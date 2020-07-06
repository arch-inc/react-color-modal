import { useMemo, useRef, useEffect } from "react";
import { NextPage } from "next";
import Head from "next/head";
import {
  Container,
  Message,
  Divider,
  List,
  Icon,
  Header,
} from "semantic-ui-react";
import { Body } from "../components/Body";

const basePath = process.env.BASE_PATH.replace(/\/$/, "");
const packageName = "react-color-modal";
const description = "Yet another color picker component for React";

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title key="title">
          {packageName} | {description}
        </title>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.4/dist/semantic.min.css"
        ></link>
      </Head>
      <style jsx>{`
        :global(html, body) {
          background: #eee;
        }
        div.hero {
          padding: 3em 0;
        }
        div.main.content {
          background: #fff;
          padding: 2em 0 0 0;
        }
        div.demo-wrapper {
          background: #f5f5f5;
          margin: 2em auto 0 auto;
          padding: 2em 0;
        }
        footer {
          padding: 2em 0;
        }
      `}</style>
      <div className="hero">
        <Container>
          <Header as="h1" content={packageName} subheader={description} />
        </Container>
      </div>
      <div className="main content">
        <Container>
          <Message
            header="How to install"
            content={
              <>
                <pre>npm i {packageName}</pre>
                <p>
                  For more details on how to use this library, please refer to
                  the following documents.
                </p>
              </>
            }
          />
          <div className="ui selection divided list">
            <a
              className="item"
              href={`https://www.npmjs.com/package/${packageName}`}
            >
              <i className="npm icon"></i>
              <div className="content">
                <div className="header">NPM package registry</div>
                <div className="description">{packageName}</div>
              </div>
            </a>
            <a
              className="item"
              href={`https://github.com/arch-inc/${packageName}`}
            >
              <i className="github icon"></i>
              <div className="content">
                <div className="header">GitHub repository</div>
                <div className="description">{packageName}</div>
              </div>
            </a>
            <a
              className="item"
              href={`https://arch-inc.github.io/${packageName}/api/globals.html`}
            >
              <i className="file alternate outline icon"></i>
              <div className="content">
                <div className="header">API document</div>
                <div className="description">
                  automatically generated with TypeDoc
                </div>
              </div>
            </a>
          </div>
        </Container>
        <div className="demo-wrapper">
          <Container>
            <Header as="h3" content="Live demo" />
            <p>A simple color palette example is shown below.</p>
            <Divider />
            <Body />
          </Container>
        </div>
      </div>
      <footer>
        <Container>
          <List horizontal divided>
            <List.Item
              content={
                <>
                  &copy; <a href="//research.archinc.jp">Arch Inc.</a> 2020
                </>
              }
            />
            <List.Item
              content={
                <a href={`https://github.com/arch-inc/${packageName}`}>
                  <Icon name="github" /> arch-inc/{packageName}
                </a>
              }
            />
          </List>
        </Container>
      </footer>
    </>
  );
};

export default Index;
