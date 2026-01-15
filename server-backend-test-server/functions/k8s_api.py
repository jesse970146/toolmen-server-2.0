from kubernetes import client, config
import re
from jinja2 import Template
import yaml
import os

try:
    config.load_kube_config()
except:
    pass
try:
    config.load_incluster_config()
except:
    pass

core_v1_api = client.CoreV1Api()
networking_v1_api = client.NetworkingV1Api()

def parse_pod(pod):
    """Return a json object from pod object"""
    dockerid = ""
    # container_id has prefix docker://
    if pod.status.container_statuses[0].container_id:
        dockerid = re.findall(r"\w+$", pod.status.container_statuses[0].container_id)[0]
    return {
        'name': pod.metadata.name,
        'image': pod.spec.containers[0].image,
        'status': pod.status.phase,
        'reason': pod.status.reason,
        'start': pod.status.start_time,
        'docker_id': dockerid,
        'ip': pod.status.pod_ip,
        'node': pod.spec.node_name,
    }


def create_namespace(ns):
    try:
        core_v1_api = client.CoreV1Api()
        body = client.V1Namespace(
            metadata=client.V1ObjectMeta(
                name=ns
            ),
        )
        core_v1_api.create_namespace(body=body)
    except:
        pass


def create_pod(ns, name, username, token, node):
    text_pod = open("functions/template/pod.yml").read()
    template_pod = Template(text_pod).render({
        'image': 'mltooling/ml-workspace-gpu:0.13.2',
        'token': token,
        'namespace': ns,
        'name': name,
        'username': username,
        'node': node
    })
    template_pod = yaml.load(template_pod, Loader=yaml.FullLoader)
    core_v1_api.create_namespaced_pod(ns, template_pod)


def create_service(ns, name):
    text_service = open("functions/template/service.yml").read()
    template_service = Template(text_service).render({
        'namespace': ns,
        'name': name
    })
    template_service = yaml.load(template_service, Loader=yaml.FullLoader)
    core_v1_api.create_namespaced_service(ns, template_service)


def create_ingress(ns, name):
    text_ingress = open("functions/template/ingress.yml").read()
    template_ingress = Template(text_ingress).render({
        'namespace': ns,
        'name': name
    })
    template_ingress = yaml.load(template_ingress, Loader=yaml.FullLoader)
    networking_v1_api.create_namespaced_ingress(ns, template_ingress)

def delete_pod(ns, name):
    core_v1_api.delete_namespaced_pod(name, ns)

def delete_service(ns, name):
    core_v1_api.delete_namespaced_service(name, ns)

def delete_ingress(ns, name):
    networking_v1_api.delete_namespaced_ingress(name, ns)