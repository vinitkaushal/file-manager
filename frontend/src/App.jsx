import TopBar from './components/TopBar/TopBar';
import Sidebar from './components/Sidebar/Sidebar';
import "./style/style.css"
import MiddleSection from './components/MiddleSection/MiddleSection';
import CreateFolderModal from './components/CreateFolderModal/CreateFolderModal';
import UploadFileModal from './components/UploadFileModal/UploadFileModal';
import DeleteFileFolder from './components/DeleteFileFolder/DeleteFileFolder';

function App() {
  const handlePathChange = (newPath) => {
    console.log('Navigating to:', newPath);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div
        className="main-content"
      >
        <div className="top-section">
          <TopBar path="NSM/Folders & Documents" onNavigate={handlePathChange} />
        </div>

        <div className="middle-section">
          <MiddleSection />
        </div>
        <CreateFolderModal />
        <UploadFileModal />
        <DeleteFileFolder />
      </div>
    </div>
  );
}
export default App;