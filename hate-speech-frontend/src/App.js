import "./App.css";
import { useState, useEffect } from "react";
import PhoneInterface from "./components/PhoneInterface/PhoneInterface";
import SafeTalkApp from "./components/SafeTalkApp/SafeTalkApp";

const AVATAR_STORAGE_KEY = "safetalk_avatar";

function App() {
  const [currentView, setCurrentView] = useState("home");
  const [safetalkInitialTab, setSafetalkInitialTab] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AVATAR_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserAvatar(parsed);
      }
    } catch (e) {
      console.warn("Failed to load avatar from storage:", e);
    }
  }, []);

  const handleSafeTalkClick = () => {
    setSafetalkInitialTab(null);
    setCurrentView("safetalk");
  };

  const handleNavigateToCommunity = () => {
    setSafetalkInitialTab("community");
    setCurrentView("safetalk");
  };

  const handleBackClick = () => {
    setCurrentView("home");
  };

  const handleAvatarCreated = (avatarData) => {
    setUserAvatar(avatarData);
    try {
      localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(avatarData));
    } catch (e) {
      console.warn("Failed to save avatar to storage:", e);
    }
    setCurrentView("home");
  };

  if (currentView === "safetalk") {
    return (
      <SafeTalkApp
        onBack={handleBackClick}
        onAvatarCreated={handleAvatarCreated}
        initialTab={safetalkInitialTab}
        onInitialTabConsumed={() => setSafetalkInitialTab(null)}
      />
    );
  }

  return (
    <div className="App">
      <PhoneInterface
        onSafeTalkClick={handleSafeTalkClick}
        onNavigateToCommunity={handleNavigateToCommunity}
        userAvatar={userAvatar}
      />
    </div>
  );
}

export default App;
