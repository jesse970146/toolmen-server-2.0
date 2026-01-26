import React from "react";
import { Typography, Card, Divider, Alert, Image, Steps } from "antd";
import { 
  LoginOutlined, 
  PlusCircleOutlined, 
  CodeOutlined, 
  YoutubeOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";

// Images
import workspaceImg from "../assets/images/workspace.png";
import createWorkspaceImg from "../assets/images/createWorkspace.png";
import homepageImg from "../assets/images/Homepage.png";

const { Title, Paragraph, Text, Link } = Typography;

const HelpTab = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* 1. Header Section */}
      <div className="text-center mb-10">
        <Title level={1} className="!mb-2">Toolmen 2.0 User Guide</Title>
        <Paragraph type="secondary" className="text-lg">
          Everything you need to know to get started with your workspaces.
        </Paragraph>
      </div>

      {/* 2. Video Tutorial Section (預留區塊) */}
      <Card className="mb-10 shadow-sm border-gray-200 overflow-hidden" bodyStyle={{ padding: 0 }}>
        {/* 移除 group cursor-pointer，保留比例容器 */}
        <div className="w-full aspect-video bg-black flex flex-col items-center justify-center relative">
          
          {/* 直接放入 iframe，並填上您的影片 ID */}
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/Mwd0Voio0-I" 
            title="Toolmen Tutorial" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen 
          ></iframe>

          {/* 原本的 YoutubeOutlined 和文字都刪除，否則會擋在影片上面 */}
        
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <Text strong>🎥 Watch the full walkthrough</Text>
          <Text type="secondary" className="ml-2">
            Learn how to create and manage your environment in 3 minutes.
          </Text>
        </div>
      </Card>

      <Divider />

      {/* 3. Documentation Content */}
      <div className="flex flex-col gap-12">
        
        {/* Step 1: Login */}
        <section id="login">
          <div className="flex items-center gap-2 mb-4">
            <LoginOutlined className="text-2xl text-blue-500" />
            <Title level={2} className="!m-0">1. Access & Login</Title>
          </div>
          <Paragraph>
            Access the platform via the official link below using your credentials.
          </Paragraph>
          <div className="bg-blue-50 p-4 rounded-lg mb-6 inline-block">
            <Text strong>Website: </Text>
            <Link href="https://server.toolmen.bime.ntu.edu.tw" target="_blank" className="text-lg ml-2">
              https://server.toolmen.bime.ntu.edu.tw
            </Link>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <Image src={homepageImg} alt="Homepage" />
          </div>
        </section>

        {/* Step 2: Create Workspace */}
        <section id="create">
          <div className="flex items-center gap-2 mb-4">
            <PlusCircleOutlined className="text-2xl text-blue-500" />
            <Title level={2} className="!m-0">2. Create New Workspace</Title>
          </div>
          <Paragraph>
            Click the <Text strong className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded">+ Create New Workspace</Text> button on the dashboard to start.
          </Paragraph>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 h-fit">
              <Image src={createWorkspaceImg} alt="Create Workspace Modal" />
            </div>
            <div className="flex flex-col justify-center">
               <Alert
                message="Naming Rules"
                description={
                  <ul className="list-disc pl-4 mt-2 mb-0 text-gray-600">
                    <li>Less than 30 characters</li>
                    <li>No capital letters (lowercase only)</li>
                    <li>No underscores ( <code>_</code> ), use hyphens (<code>-</code>) instead</li>
                  </ul>
                }
                type="warning"
                showIcon
                className="mb-6"
              />
              <Steps
                direction="vertical"
                size="small"
                current={-1}
                items={[
                  { title: 'Step 1', description: 'Enter a valid workspace name.' },
                  { title: 'Step 2', description: 'Select the target Server (Compute Node).' },
                  { title: 'Step 3', description: 'Choose the Environment Image (e.g., Ubuntu, TensorFlow).' },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Step 3: Usage & SSH */}
        <section id="usage">
          <div className="flex items-center gap-2 mb-4">
            <CodeOutlined className="text-2xl text-blue-500" />
            <Title level={2} className="!m-0">3. Connect & Manage</Title>
          </div>
        

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Web Interface" size="small" className="h-full">
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li><Text strong>Desktop:</Text> Opens a VNC remote desktop in your browser.</li>
                <li><Text strong>Jupyter:</Text> Opens JupyterLab for coding.</li>
                <li><Text strong>More (⋮):</Text> Delete or Restart your workspace.</li>
              </ul>
            </Card>

            <Card title="SSH Connection" size="small" className="h-full bg-gray-50">
              <div className="flex flex-col h-full justify-between">
                <Paragraph>
                  You can connect to your workspace via terminal using SSH.
                </Paragraph>
                <div>
                  <Text type="secondary" className="text-xs uppercase font-bold">Command</Text>
                  {/* 使用 AntD 的 copyable 屬性，方便使用者複製 */}
                  <Paragraph 
                    copyable={{ text: "ssh -p 8787 workspace_name@toolmen.bime.ntu.edu.tw" }}
                    className="bg-gray-800 text-green-400 p-3 rounded-md font-mono text-sm mt-1 mb-0"
                  >
                    ssh -p 8787 workspace_name@toolmen.bime.ntu.edu.tw
                  </Paragraph>
                  <div className="mt-2 flex items-start gap-1 text-xs text-gray-500">
                     <InfoCircleOutlined className="mt-0.5"/> 
                     <span>Replace <code>workspace_name</code> with your actual workspace name.</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

      </div>
      
      <div className="mt-12 text-center text-gray-400 pb-8">
        Toolmen Server 2.0 Documentation © 2026
      </div>
    </div>
  );
};

export default HelpTab;