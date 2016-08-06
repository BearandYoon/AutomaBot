export class Navbar {
    bg: string;
    logo: string;
}

export class Infobox {
  header: {
      bg: string;
      title: string;
      subtitle: string;
  };
  body: {
      bg: string;
  }
}

export class ChatWindow {
    bg: string;
    sentBubble: string;
    userBubble: string;
    quickReplies: {
        bg: string;
        border: string;
    }
}

export class Bot {
    name: string;
    email: string;
    avatar: string;
}

export class BotDesignModel {
    _id: string;
    chatWindow: ChatWindow;
    infoBox: Infobox;
    navbar: Navbar;
    bot: Bot;
}