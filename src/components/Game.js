import React from "react";
import { observer, Observer } from "mobx-react";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import LevelPlay from "./LevelPlay";
import LevelMenu from "./LevelMenu";
import LevelEditor from "./LevelEditor";
import { AppDiv } from "./Style";

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
  padding: 0 0.2345em;
  height: ${props => props.height};
  box-shadow: 1.11px 1.11px 1.11px 1.11px #aaa;

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
    font-size: 3.1415em;
    font-weight: normal;
  }

  & a {
    text-decoration: none;
    color: paleturquoise;
  }
`;

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
          <h1>Sokoban</h1>
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
            <div className="icon" onClick={store.levelPlayStore.goBack}>⌂</div>
            Moves: <Observer>
              {() => store.levelPlayStore.state.moveCount}
            </Observer>
            <div className="icon" onClick={store.levelPlayStore.gotoEditor}>
              ✎
            </div>
          </nav>
        </Banner>
      );
    case "EDITOR":
      return (
        <Banner>
          <nav style={{ width: 960 }}>
            <div className="icon" onClick={confirmAndGoBack}>
              ⇐
            </div>
            <div>Editor</div>
            <div />
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
