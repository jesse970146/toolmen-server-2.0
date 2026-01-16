from kubernetes import client, config
from jinja2 import Template
from flask import Flask, jsonify, redirect, request, abort
import yaml
import re
import os
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv(".env")


app = Flask(__name__)
cors = CORS(app)

ns = os.environ.get("NAMESPACE") or "default"
workspace_base_url = os.environ.get("WORKSPACE_BASE_URL")

try:
    config.load_kube_config()
except:
    pass
try:
    config.load_incluster_config()
except:
    pass

apps_v1_api = client.AppsV1Api()
core_v1_api = client.CoreV1Api()
networking_v1_api = client.NetworkingV1Api()
custom_v1_api = client.CustomObjectsApi()

@app.errorhandler(Exception)
def AllError(error):
    """
    Catch all error here.
    This function will call if the error cannot handle by my code.
    Returns
    -------
    json
        The status code will be 500.
        There will have a key named "status" and its value is 500.
        The message will show why this happened.
    """
    message = {
        'status': 500,
        'message': "Internal Error: " + str(error)
    }
    app.logger.debug("Error: " + str(error))
    resp = jsonify(message)
    resp.status_code = 500
    return resp


@app.errorhandler(400)
def Error(error):
    """
    Handle error here.
    Returns
    -------
    json
        The status code will be 400.
        There will have a key named "status" and its value is 400.
        The message will show why this happened.
    """
    app.logger.debug("Error: " + str(error))
    message = {
        'status': 400,
        'message': str(error)
    }
    resp = jsonify(message)
    resp.status_code = 400
    return resp


def ok(data={}):
    """Handle all return data here."""
    return jsonify({
        'data': data
    }), 200

def get_nodes():
    """ return a list of node name"""
    return [node.metadata.name for node in core_v1_api.list_node().items]
    

@app.route("/")
def hello():
    """ Hello """
    return ok()

# @app.route("/node/<lab>")
# def get_nodes_with_label(lab):
#     """Return a list of node names with the specified label (via GET query param)"""
#     if not lab:
#         return jsonify({"error": "Missing 'lab' query parameter"}), 400

#     label_selector = f"lab={lab}"
#     nodes = core_v1_api.list_node(label_selector=label_selector).items
#     node_names = [node.metadata.name for node in nodes]
#     return jsonify(node_names)

@app.route("/node/<lab>")
def get_nodes_with_label(lab):
    """Return a list of node names where 'lab' label contains the input substring"""
    if not lab:
        return jsonify({"error": "Missing 'lab' parameter"}), 400

    # 取得所有節點
    all_nodes = core_v1_api.list_node().items

    matched_nodes = []
    for node in all_nodes:
        labels = node.metadata.labels or {}
        lab_value = labels.get("lab", "")
        # 檢查是否包含 lab 子字串（不區分大小寫）
        if lab.lower() in lab_value.lower():
            matched_nodes.append(node.metadata.name)

    return jsonify(matched_nodes)

@app.route("/create", methods=["POST"])
def create():
    """
    Create the Pod. The task will not be done when giving out response. Should use "search" to check.

    Parameters
    ----------
    name: str
        The POD (workspace) name.
    token: str
        The token insert to workspace.
    username: str
        Used as the SUBPATH of VOLUME "nfs-nas-personal".
    node: str
        The NODE to create the pod.
    image: str
        The base image you want to start.
    command: str
        Commands to execute.
        Default: null
    """
    # read and handle error
    data = request.get_json()
    print(data)
    name = data['name']
    print(name)
    # check if node exists
    if not (data.get('node') and data.get('node') in get_nodes()):
        print(f"{data.get('node')} not found. Using {get_nodes()[0]} instead.")
        data['node'] = get_nodes()[0]
    print(data)
    # render pod
    # text_pod = open("template/pod.yml").read()
    # template_pod = Template(text_pod).render({
    #     **data,
    #     "namespace": ns
    # })
    # template_pod = yaml.load(template_pod, Loader=yaml.FullLoader)
    
    # core_v1_api.create_namespaced_pod(ns, template_pod)

    # render deployment
    text_deploy = open("template/deployment.yml").read()
    template_deploy = Template(text_deploy).render({
        **data,
        "namespace": ns
    })
    template_deploy = yaml.load(template_deploy, Loader=yaml.FullLoader)

    apps_v1_api.create_namespaced_deployment(namespace=ns, body=template_deploy)
    
    # service
    text_service = open("template/service.yml").read()
    template_service = Template(text_service).render({
        'namespace': ns,
        'name': name
    })
    template_service = yaml.load(template_service, Loader=yaml.FullLoader)
    core_v1_api.create_namespaced_service(ns, template_service)
    
    # # ingress
    text_ingress = open("template/ingress.yml").read()
    template_ingress = Template(text_ingress).render({
        'namespace': ns,
        'name': name,
        'host': workspace_base_url
    })
    template_ingress = yaml.load(template_ingress, Loader=yaml.FullLoader)
    networking_v1_api.create_namespaced_ingress(ns, template_ingress)

    # # pipe
    text_pipe = open("template/pipe.yml").read()
    template_pipe = Template(text_pipe).render({
        'namespace': ns,
        'name': name,
        'username': data['username']
    })
    template_pipe = yaml.load(template_pipe, Loader=yaml.FullLoader)
    custom_v1_api.create_namespaced_custom_object(
    group= "sshpiper.com",
    version= "v1beta1",
    namespace= ns,
    plural= "pipes",
    body= template_pipe
    )
    
    return ok()


@app.route("/delete", methods=["POST"])
def delete():
    """
    Delete the pod,ingress,service by name
    The task will not be done when giving out response.
    Should use "search" to check.
    """

    data = request.get_json()
    name = data['name']
    apps_v1_api.delete_namespaced_deployment(name, ns)
    # core_v1_api.delete_namespaced_pod(name, ns)
    
    core_v1_api.delete_namespaced_service(name, ns)
    networking_v1_api.delete_namespaced_ingress(name, ns)
    custom_v1_api.delete_namespaced_custom_object(
        group="sshpiper.com",
        version="v1beta1",
        namespace= ns,
        plural="pipes",
        name= name
    )
    
    return ok()

@app.route("/restart", methods=["POST"])
def restart():
    try:
        data = request.get_json()
        pod_name = data['name']
        label_selector = f"labbox-pod-name={pod_name}"
        pods = core_v1_api.list_namespaced_pod(
            namespace="toolmen",
            label_selector=label_selector
        ).items
        pod = pods[0]
        core_v1_api.delete_namespaced_pod(name=pod.metadata.name, namespace=ns)
        return ok()
    except Exception as e:
        return jsonify({"error": str(e)}), 404



@app.route("/api/pod_status/<pod_name>")
def get_pods_status(pod_name):
    try:
        label_selector = f"labbox-pod-name={pod_name}"
        pods = core_v1_api.list_namespaced_pod(
            namespace="toolmen",
            label_selector=label_selector
        ).items

        if not pods:
            return jsonify({"error": "No pods found"}), 404
        if len(pods) == 1:
            pod = pods[0]  # 取第一個 Pod
            return jsonify({
                "name": pod.metadata.name,
                "status": pod.status.phase, 
            })
        else :
            pod = pods[0]  # 取第一個 Pod
            return jsonify({
                "name": pod.metadata.name,
                "status": "Restarting", 
            })

    except Exception as e:
        return jsonify({"error": str(e)}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3476, debug=True)
