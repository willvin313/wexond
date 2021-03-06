import { ipcRenderer } from 'electron';
import { observer } from 'mobx-react'; // eslint-disable-line no-unused-vars
import React from 'react';

// Enums
import { Platforms } from '../../../shared/enums';
import { Icons } from '../../enums';

// Utils
import { closeWindow, maximizeWindow, minimizeWindow } from '../../utils/window';
import { getPlugins } from '../../utils/plugins';

// Components
import AddressBar from '../AddressBar';
import Pages from '../Pages';
import TabBar from '../TabBar';
import ToolBar from '../ToolBar';
import ToolBarButton from '../ToolBarButton';
import ToolBarSeparator from '../ToolBarSeparator';
import WindowButton from '../WindowButton';

// Styles
import { Handle, Line, NavIcons, StyledApp, TabsSection } from './styles';

// Models
import PluginAPI from '../../models/plugin-api';

import Store from '../../store';

interface IState {
  isFullscreen: boolean;
  toolbarStyle: any;
}

@observer
export default class App extends React.Component<{}, IState> {
  public state: IState = {
    isFullscreen: false,
    toolbarStyle: {},
  };

  public async componentDidMount() {
    ipcRenderer.on('fullscreen', (e: any, isFullscreen: boolean) => {
      this.setState({
        isFullscreen,
      });
    });

    window.addEventListener('mousemove', (e) => {
      Store.mouse.x = e.pageX;
      Store.mouse.y = e.pageY;
    });

    const plugins = await getPlugins();

    for (const plugin of plugins) {
      const api = plugin.run() as PluginAPI;
      this.setState({
        toolbarStyle: {
          ...this.state.toolbarStyle,
          ...api.styleToolbar(),
        },
      });
    }
  }

  public render() {
    const { isFullscreen } = this.state;

    return (
      <StyledApp>
        <ToolBar style={{ ...this.state.toolbarStyle }}>
          <Handle />
          <NavIcons isFullscreen={isFullscreen}>
            <ToolBarButton size={24} icon={Icons.Back} />
            <ToolBarButton size={24} icon={Icons.Forward} />
            <ToolBarButton size={20} icon={Icons.Refresh} />
          </NavIcons>
          <ToolBarSeparator />
          <TabsSection>
            <AddressBar visible={Store.addressBar.toggled} />
            <TabBar />
          </TabsSection>
          <ToolBarSeparator />
          <ToolBarButton size={16} icon={Icons.TabGroups} />
          <ToolBarButton size={18} icon={Icons.More} />
          {Store.platform !== Platforms.MacOS && (
            <React.Fragment>
              <ToolBarSeparator />
              <WindowButton icon={Icons.Minimize} onClick={minimizeWindow} />
              <WindowButton icon={Icons.Maximize} onClick={maximizeWindow} />
              <WindowButton icon={Icons.Close} onClick={closeWindow} />
            </React.Fragment>
          )}
          <Line />
        </ToolBar>
        <Pages />
      </StyledApp>
    );
  }
}
