import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import { Body } from "../components/Body";

const basePath = process.env.BASE_PATH.replace(/\/$/, "");
const packageName = "react-color-modal";
const description = "Yet another color picker component for React";

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title key="title">{`${packageName} | ${description}`}</title>
      </Head>
      <style jsx>{`
        :global(html, body) {
          background: #eee;
          color: #222;
          font-family: system-ui, sans-serif;
          margin: 0;
        }
        .container {
          box-sizing: border-box;
          margin: auto;
          max-width: 960px;
          padding: 0 24px;
        }
        div.hero {
          padding: 3em 0;
        }
        h1 small {
          display: block;
          font-size: 0.5em;
          font-weight: normal;
          margin-top: 0.4em;
        }
        div.main.content {
          background: #fff;
          padding: 2em 0 0 0;
        }
        .message {
          background: #f6f8fa;
          border: 1px solid #d0d7de;
          border-radius: 6px;
          padding: 16px;
        }
        .links {
          display: grid;
          gap: 8px;
          margin: 24px 0;
        }
        .links a {
          border-bottom: 1px solid #ddd;
          padding: 10px 0;
        }
        div.demo-wrapper {
          background: #f5f5f5;
          margin: 2em auto 0 auto;
          padding: 2em 0;
        }
        footer {
          padding: 2em 0;
        }
        footer .container {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
      `}</style>
      <div className="hero">
        <div className="container">
          <h1>
            {packageName}
            <small>{description}</small>
          </h1>
        </div>
      </div>
      <div className="main content">
        <div className="container">
          <div className="message">
            <h2>How to install</h2>
            <pre>npm i {packageName}</pre>
            <p>
              For more details on how to use this library, please refer to the
              following documents.
            </p>
          </div>
          <div className="links">
            <a href={`https://www.npmjs.com/package/${packageName}`}>
              NPM package registry — {packageName}
            </a>
            <a href={`https://github.com/arch-inc/${packageName}`}>
              GitHub repository — {packageName}
            </a>
            <a
              href={`https://arch-inc.github.io/${packageName}/api/globals.html`}
            >
              API document — generated with TypeDoc
            </a>
          </div>
        </div>
        <div className="demo-wrapper">
          <div className="container">
            <h2>Live demo</h2>
            <p>Example color pickers are shown below.</p>
            <hr />
            <Body />
          </div>
        </div>
      </div>
      <footer>
        <div className="container">
          <span>
            &copy; <a href="//research.archinc.jp">Arch Inc.</a> 2020-2026
          </span>
          <a href={`https://github.com/arch-inc/${packageName}`}>
            arch-inc/{packageName}
          </a>
        </div>
      </footer>
    </>
  );
};

export default Index;
