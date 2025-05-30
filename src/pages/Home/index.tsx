import WorkspaceSelector from './WorkspaceSelector';
import './Home.css';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { useCurrentUserStore } from '../../modules/auth/current-user.state';
import { Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Workspace } from '../../modules/workspaces/workspace.entity';
import { workspaceRepository } from '../../modules/workspaces/workspace.repository';
import { Channel } from '../../modules/channels/channel.entity';
import { channelRepository } from '../../modules/channels/channel.repository';
import { Message } from '../../modules/messages/message.entity';
import { messageRepository } from '../../modules/messages/message.repository';
import { subsribe, unsubscribe } from '../../lib/api/socket';

function Home() {
  const { currentUser } = useCurrentUserStore();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const params = useParams();
  const { workspaceId, channelId } = params;
  const selectedWorkspace = workspaces.find(
    (workspace) => workspace.id == workspaceId
  );
  const selectedChannel = channels.find((channel) => channel.id == channelId);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    fetchChannels();
    subsribe(workspaceId!, handleNewMessage, handleDeleteMessage);
    return () => {
      unsubscribe(workspaceId!);
    };
  }, [workspaceId]);

  useEffect(() => {
    fetchMessages();
  }, [channelId]);

  const fetchWorkspaces = async () => {
    try {
      const workspaces = await workspaceRepository.find();
      setWorkspaces(workspaces);
    } catch (error) {
      console.error('ワークスペースの取得に失敗しました', error);
    }
  };

  const handleNewMessage = (message: Message) => {
    setMessages((messages) => [message, ...messages]);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((messages) => messages.filter((msg) => msg.id !== messageId));
  };

  const fetchChannels = async () => {
    try {
      const channels = await channelRepository.find(workspaceId!);
      setChannels(channels);
    } catch (error) {
      console.error('チャンネルの取得に失敗しました', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const messages = await messageRepository.find(workspaceId!, channelId!);
      setMessages(messages);
    } catch (error) {
      console.error('メッセージの取得に失敗しました', error);
    }
  };

  if (currentUser == null) return <Navigate to="/signin" />;

  return (
    <div className="slack-container">
      <WorkspaceSelector
        workspaces={workspaces}
        setWorkspaces={setWorkspaces}
        selectedWorkspaceId={workspaceId!}
      />
      {selectedWorkspace != null && selectedChannel != null ? (
        <>
          <Sidebar
            selectedWorkspace={selectedWorkspace}
            channels={channels}
            selectedChannelId={channelId!}
            setChannels={setChannels}
          />
          <MainContent
            selectedChannel={selectedChannel}
            channels={channels}
            setChannels={setChannels}
            selectedWorkspaceId={workspaceId!}
            messages={messages}
            setMessages={setMessages}
          />
        </>
      ) : (
        <div className="sidebar" />
      )}
    </div>
  );
}

export default Home;
