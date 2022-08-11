import React, { FC, useState, useCallback, MouseEvent } from "react";
import tinycolor from "tinycolor2";

import {
  ColorButton,
  ColorPanel,
  HorizontalColorPanel,
  Panel,
  ColorInput,
  Dimmer,
  TinyColorInstance,
} from "../../";
import { List } from "semantic-ui-react";

export const Body: FC = () => {
  const [color, setColor] = useState<TinyColorInstance>(tinycolor("#008c8c"));
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const toggleModal = useCallback(
    (ev: MouseEvent) => {
      const list = (ev.target as HTMLElement).classList;
      if (list.contains("modal") || list.contains("color-button")) {
        setModalOpen(!modalOpen);
      } else {
        console.log("ignore event from", ev.target);
      }
    },
    [modalOpen]
  );

  const toggleDropdown = useCallback(() => {
    setDropdownOpen(!dropdownOpen);
  }, [dropdownOpen]);

  return (
    <div className="demo body">
      <style jsx>{`
        section {
          margin: 2em 0;
        }
        section > p {
          text-align: center;
        }
        section > p > code {
          font-weight: bold;
        }
        section:last-child {
          margin-bottom: 0;
        }
        section :global(> div) {
          margin: auto;
        }
        section :global(> div) {
          max-width: 480px !important;
        }
        section.scrollable .content {
          max-width: 720px !important;
          overflow-x: auto;
        }

        // modal
        :global(.modal) {
          display: flex;
          align-items: center;
        }
        :global(.modal > div) {
          max-width: 960px;
          margin: 2em auto;
        }

        // dropdown
        .dropdown {
          position: relative;
        }
        .dropdown :global(> div) {
          position: absolute;
          top: 0.5em;
          left: 0;
        }

        // smaller font size
        section.small :global(> div) {
          font-size: 72%;
        }

        // larger font size
        section.large :global(> div) {
          font-size: 140%;
        }
      `}</style>
      <section>
        <p>
          <code>ColorButton</code>
        </p>
        <Panel>
          <List horizontal>
            <List.Item>
              <ColorButton onClick={toggleModal} borderColor={color}>
                Button with modal
              </ColorButton>
            </List.Item>
            <List.Item>
              <ColorButton onClick={toggleDropdown} borderColor={color}>
                Button with dropdown
              </ColorButton>
            </List.Item>
          </List>
          {modalOpen && (
            <Dimmer
              className="modal"
              onClick={toggleModal}
              style={{ backgroundColor: "rgba(0,0,0,0.3)", overflow: "auto" }}
            >
              <HorizontalColorPanel
                raised={true}
                color={color}
                onColorUpdate={setColor}
              />
            </Dimmer>
          )}
          {dropdownOpen && (
            <>
              <div className="dropdown">
                <ColorPanel
                  raised={true}
                  color={color}
                  onColorUpdate={setColor}
                />
              </div>
              <Dimmer onClick={toggleDropdown} />
            </>
          )}
        </Panel>
      </section>
      <section>
        <p>
          <code>ColorPanel</code>
        </p>
        <ColorPanel color={color} onColorUpdate={setColor} />
      </section>
      <section className="small">
        <p>
          <code>ColorPanel (smaller font size)</code>
        </p>
        <ColorPanel color={color} onColorUpdate={setColor} />
      </section>
      <section className="large">
        <p>
          <code>ColorPanel (larger font size)</code>
        </p>
        <ColorPanel color={color} onColorUpdate={setColor} />
      </section>
      <section className="scrollable">
        <p>
          <code>HorizontalColorPanel</code>
        </p>
        <div className="content">
          <HorizontalColorPanel color={color} onColorUpdate={setColor} />
        </div>
      </section>
      <section>
        <p>
          <code>ColorInput</code>
        </p>
        <Panel>
          Selected color: <ColorInput color={color} onColorUpdate={setColor} />
        </Panel>
      </section>
    </div>
  );
};
