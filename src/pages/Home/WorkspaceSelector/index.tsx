import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../../modules/ui/ui.state';
import { workspaceRepository } from '../../../modules/workspaces/workspace.repository';
import CreateWorkspaceModal from './CreateWorkspaceModal';
import ProfileModal from './ProfileModal';
import { Workspace } from '../../../modules/workspaces/workspace.entity';
import { useCurrentUserStore } from '../../../modules/auth/current-user.state';

interface Props {
  workspaces: Workspace[];
  setWorkspaces: (workspaces: Workspace[]) => void;
  selectedWorkspaceId: string;
}

function WorkspaceSelector(props: Props) {
  const { workspaces, setWorkspaces, selectedWorkspaceId } = props;
  const {
    showCreateWorkspaceModal,
    setShowCreateWorkspaceModal,
    showProfileModal,
    setShowProfileModal,
  } = useUiStore();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useCurrentUserStore();

  const createWorkspace = async (name: string) => {
    try {
      const newWorkspace = await workspaceRepository.create(name);
      setShowCreateWorkspaceModal(false);
      setWorkspaces([...workspaces, newWorkspace]);
      navigate(`/${newWorkspace.id}/${newWorkspace.channels[0].id}`);
    } catch (error) {
      console.error('ワークスペースの作成に失敗しました', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(undefined);
  };

  return (
    <div className="workspace-selector">
      <div className="workspaces">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className={`workspace-icon ${
              selectedWorkspaceId == workspace.id ? 'active' : ''
            }`}
            onClick={() =>
              navigate(`/${workspace.id}/${workspace.channels[0].id}`)
            }
          >
            {workspace.name.charAt(0)}
          </div>
        ))}
        <div
          className="workspace-icon add"
          onClick={() => setShowCreateWorkspaceModal(true)}
        >
          +
        </div>
      </div>
      <div className="user-profile">
        <div
          className={`avatar-img `}
          onClick={() => setShowProfileModal(true)}
        >
          <img
            src={currentUser!.iconUrl}
            alt="Posted image"
            className="message-image"
          />
        </div>
        <div className="logout-button" title="ログアウト" onClick={logout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </div>
      </div>
      {showCreateWorkspaceModal && (
        <CreateWorkspaceModal onSubmit={createWorkspace} allowCancel={true} />
      )}
      {showProfileModal && <ProfileModal />}
    </div>
  );
}
export default WorkspaceSelector;
