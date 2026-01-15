import React from "react";
import workspace from "../assets/images/workspace.png";
import createworkspace from "../assets/images/createWorkspace.png"
import homepage from "../assets/images/Homepage.png"

const HelpTab = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "40px", lineHeight: 1.6 }}>
      <h1 style={{ color: "#2c3e50" }}>Toolmen 2.0 User Documentation</h1>

      <h2 style={{ color: "#2c3e50" }}>Login Page</h2>
      <p>
        Website:{" "}
        <a href="https://server.toolmen.bime.ntu.edu.tw" target="_blank" rel="noopener noreferrer">
          https://server.toolmen.bime.ntu.edu.tw
        </a>
      </p>

      <h2 style={{ color: "#2c3e50" }}>After Login</h2>
      <img
        src= {homepage}
        alt="Login Page Screenshot"
        style={{ maxWidth: "100%", height: "auto", border: "1px solid #ccc", margin: "10px 0" }}
      />

      <h3>Create New Workspace</h3>
      <ul>
        <li>
          Press <strong>+ Create New Workspace</strong> to create new workspace
        </li>
      </ul>
      <img
        src= {createworkspace}
        alt="Create Workspace Screenshot"
        style={{ maxWidth: "100%", height: "auto", border: "1px solid #ccc", margin: "10px 0" }}
      />
      <ul>
        <li>
          You can name your workspace as you want, but there are some restrictions:
          <ul>
            <li>Less than 30 characters</li>
            <li>No capital letters</li>
            <li>No underscore (_)</li>
          </ul>
        </li>
        <li>Choose the server you want</li>
        <li>Choose the image</li>
      </ul>

      <h3>After the Workspace is Created</h3>
      <img
        src= {workspace}
        alt="Workspace Created Screenshot"
        style={{ maxWidth: "100%", height: "auto", border: "1px solid #ccc", margin: "10px 0" }}
      />
      <ul>
        <li><strong>Desktop:</strong> VNC interface</li>
        <li><strong>Jupyter:</strong> Jupyter interface</li>
        <li>You can delete the workspace via the <strong>More</strong> button</li>
        <li>
          <strong>SSH:</strong> You can login using the command:<br />
          <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "4px" }}>
            ssh -p 8787 workspace_name@toolmen.bime.ntu.edu.tw
          </code>
        </li>
      </ul>
    </div>
  );
};

export default HelpTab;
