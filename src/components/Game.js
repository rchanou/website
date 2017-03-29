import React from "react";
import { observer, Observer } from "mobx-react";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import LevelPlay from "./LevelPlay";
import LevelMenu from "./LevelMenu";
import LevelEditor from "./LevelEditor";
import { AppDiv } from "./Style";
import State from "./State";

import { getGameStore } from "../stores";

const defaultStore = getGameStore();

const creditSiteLink = "http://www.onlinespiele-sammlung.de/sokoban/sokobangames/skinner";

const Banner = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: darkorchid;
  color: #eee;
  padding: 0 0.2345rem;
  height: ${props => props.height};
  box-shadow: 1.11px 1.11px 1.11px 1.11px #aaa;

  text-shadow:
    -1px -1px 0 #333,  
    1px -1px 0 #333,
    -1px 1px 0 #333,
    1px 1px 0 #333;
  
  & nav {
    width: 620px;
    max-width: 100vw;
    padding: 0 6.54321px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 2.1212rem;
  }

  & .icon {
    font-weight: bold;
    cursor: pointer;
    font-size: 3.14159rem;
  }
  
  & h1 {
    font-size: 3.1415rem;
    font-weight: normal;
  }

  & a {
    text-decoration: none;
    color: paleturquoise;
  }
`;

const Help = styled.div`
  position: relative;
  cursor: pointer;
  min-width: 2rem;

  & .hint {
    text-shadow: none;
    position: absolute;
    right: 0;
    z-index: 9999;
    padding: 12.345px;
    width: 432px;
    max-width: 90vw;
    text-align: left;
    font-size: 1.3579rem;

    color: #333;
    background: #fafafa;
    box-shadow: 1.11px 1.11px 1.11px 1.11px #aaa;
  }
`;

const helpEl = (
  <State
    init={me => {
      me.state = { show: false };
      me.toggle = () => me.setState({ show: !me.state.show });
    }}
  >
    {me => (
      <Help onClick={me.toggle} title="Editor Help">
        ?
        {me.state.show &&
          <div className="hint" onClick={me.toggle}>
            Select a square by tapping it, or move it with arrow keys.
            <br />
            <br />
            Tap the square again to toggle through items, or use the buttons to place them at the square.
            <br />
            <br />
            You can zoom in for easier editing.
          </div>}
      </Help>
    )}
  </State>
);

// TODO: banner should really just be moved into corresponding pages
const BannerSwitch = ({ store }) => {
  const confirmAndGoBack = () => {
    const confirmed = confirm("Leave without saving?");
    if (confirmed) {
      store.editorStore.goBack();
    }
  };

  switch (store.state.currentView) {
    case "MENU":
      return (
        <Banner height="6.78em">
          <h1 className="title">Sokoban</h1>
          <a href={creditSiteLink} rel="noopener noreferrer" target="_blank">
            Featuring Levels Designed by David W. Skinner
          </a>

          <div>By Ron ChanOu</div>
          <div>
            Full website coming soon! Source viewable
            {" "}
            <a href="https://www.github.com/rchanou/website">here</a>
          </div>
        </Banner>
      );
    case "PLAY":
      return (
        <Banner>
          <nav>
            <div
              className="icon title"
              onClick={store.levelPlayStore.goBack}
              title="Return to Puzzle Menu"
            >
              ⌂
            </div>
            <div className="title">
              Moves: <Observer>
                {() => store.levelPlayStore.state.moveCount}
              </Observer>
            </div>
            <div
              title="Edit Puzzle"
              className="icon title"
              onClick={store.levelPlayStore.gotoEditor}
            >
              ✎
            </div>
          </nav>
        </Banner>
      );
    case "EDITOR":
      return (
        <Banner>
          <nav style={{ width: 720 }}>
            <div
              className="icon"
              onClick={confirmAndGoBack}
              title="Return to Previous Page"
            >
              ⇐
            </div>
            <div>Editor</div>
            {helpEl}
          </nav>
        </Banner>
      );
    default:
  }
};

const Game = observer(({ store = defaultStore }) => {
  let ViewToRender, storeToUse;
  switch (store.state.currentView) {
    case "MENU":
      ViewToRender = LevelMenu;
      storeToUse = store.menuStore;
      break;
    case "PLAY":
      ViewToRender = LevelPlay;
      storeToUse = store.levelPlayStore;
      break;
    case "EDITOR":
      ViewToRender = LevelEditor;
      storeToUse = store.editorStore;
      break;
    default:
      ViewToRender = LevelPlay;
      storeToUse = store.levelPlayStore;
  }

  return (
    <AppDiv>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Helmet>
      <BannerSwitch store={store} />
      <ViewToRender store={storeToUse} />
    </AppDiv>
  );
});

export default Game;
