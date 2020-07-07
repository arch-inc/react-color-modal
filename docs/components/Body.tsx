import React, { FC, useState, useCallback, MouseEvent } from "react";
import tinycolor from "tinycolor2";

import {
  ColorButton,
  ColorPanel,
  HorizontalColorPanel,
  Panel,
  ColorInput,
  Dimmer,
} from "../../";
import { List } from "semantic-ui-react";

export const Body: FC = () => {
  const [color, setColor] = useState<tinycolor.Instance>(tinycolor("#008c8c"));
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

        // horizontal panel
        section :global(> div.horizontal-color-panel) {
          max-width: 720px !important;
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
      <section>
        <p>
          <code>HorizontalColorPanel</code>
        </p>
        <HorizontalColorPanel color={color} onColorUpdate={setColor} />
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
