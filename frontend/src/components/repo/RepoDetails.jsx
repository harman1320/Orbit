import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";

import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";

import Navbar from "../Navbar.jsx";
import "./RepoDetails.css";

export default function RepoDetails() {
  const { id } = useParams();

  const [repo, setRepo] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [currentFileName, setCurrentFileName] = useState("");

  useEffect(() => {
    const fetchRepo = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/repo/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setRepo(res.data);
        console.log(repo);

        const firstFile = res.data?.content[0];

        if (firstFile) {
          const fileRawData = await axios.get(
            `${import.meta.env.VITE_CLOUDFRONT_URL}/${firstFile}`,
          );

          setFileContent(fileRawData.data);
          setCurrentFileName(firstFile.split("/").pop());
        }
      } catch (err) {
        console.error("Error while fetching repository : ", err);
      }
    };

    fetchRepo();
  }, [id]);

  const handleClick = async (filepath) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_CLOUDFRONT_URL}/${filepath}`,
      );

      setFileContent(res.data);
      setCurrentFileName(filepath.split("/").pop());
    } catch (err) {
      console.error("Error while fetching file on S3 : ", err);
    }
  };

  const files = repo?.content || [];

  return (
    <div className="repo-page min-vh-100">
      <Navbar showSearchBox={false}></Navbar>

      {/* Repository Header */}
      <div className="repo-header border-bottom">
        <div className="container-fluid px-4 py-3">

          <div className="d-flex align-items-center gap-2 mb-2">
            <FolderOutlinedIcon className="repo-header-icon" />

            <span className="repo-owner">
              orbit
            </span>

            <span className="repo-separator">
              /
            </span>

            <h4 className="repo-header-name mb-0">
              {repo?.name || "Repository"}
            </h4>

            <span className="repo-public-badge">
              {repo?.visibility ? "Private" : "Public"}
            </span>
          </div>

          <p className="repo-header-description mb-0">
            {repo?.description || "Repository files and source code"}
          </p>

        </div>
      </div>

      {/* Main Repository Area */}
      <div className="container-fluid px-4 py-4">

        <div className="row g-3">

          {/* Sidebar */}
          <div className="col-12 col-md-3 col-lg-3">

            <div className="repo-sidebar">

              {/* Sidebar Header */}
              <div className="repo-sidebar-header d-flex align-items-center justify-content-between">
                <span className="fw-semibold">
                  Files
                </span>

                <span className="repo-file-count">
                  {files.length}
                </span>
              </div>

              {/* File List */}
              <div className="list-group list-group-flush repo-file-list">

                {files.length === 0 ? (
                  <div className="repo-empty-files">
                    <InsertDriveFileOutlinedIcon />

                    <span>
                      No files found
                    </span>
                  </div>
                ) : (
                  files.map((filepath) => {
                    const fileName = filepath.split("/").pop();
                    const isActive = fileName === currentFileName;

                    return (
                      <button
                        key={filepath}
                        type="button"
                        onClick={() => handleClick(filepath)}
                        className={`list-group-item list-group-item-action repo-file-item ${
                          isActive ? "active" : ""
                        }`}
                      >
                        <InsertDriveFileOutlinedIcon />

                        <span className="text-truncate">
                          {fileName}
                        </span>
                      </button>
                    );
                  })
                )}

              </div>
            </div>
          </div>

          {/* Code Section */}
          <div className="col-12 col-md-9 col-lg-9">

            <div className="repo-code-card">

              {/* Code Header */}
              <div className="repo-code-header d-flex align-items-center justify-content-between">

                <div className="d-flex align-items-center gap-2 min-width-0">

                  <CodeOutlinedIcon className="repo-code-icon" />

                  <span className="repo-current-file text-truncate">
                    {currentFileName || "Select a file"}
                  </span>

                </div>

                {currentFileName && (
                  <span className="repo-file-label">
                    SOURCE
                  </span>
                )}

              </div>

              {/* Code */}
              <div className="repo-code-container">

                {currentFileName ? (
                  <SyntaxHighlighter
                    language="javascript"
                    style={atomDark}
                    showLineNumbers
                    wrapLongLines={false}
                    customStyle={{
                      margin: 0,
                      padding: "20px 0",
                      background: "#0d1117",
                      fontSize: "13px",
                      lineHeight: "1.6",
                      minHeight: "500px",
                    }}
                    lineNumberStyle={{
                      minWidth: "45px",
                      paddingRight: "16px",
                      color: "#484f58",
                      textAlign: "right",
                      userSelect: "none",
                    }}
                  >
                    {fileContent}
                  </SyntaxHighlighter>
                ) : (
                  <div className="repo-code-empty d-flex flex-column align-items-center justify-content-center">
                    <CodeOutlinedIcon />

                    <h6>
                      Select a file
                    </h6>

                    <p className="mb-0">
                      Choose a file from the repository to view its source code.
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}