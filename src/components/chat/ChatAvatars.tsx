// Chat avatar components

import { Bot, User } from "lucide-react";

export const AssistantAvatar = () => (
  <div className="size-9 rounded-xl bg-blue-600/90 grid place-items-center shadow">
    <Bot className="size-5 text-white" />
  </div>
);

export const UserAvatar = () => (
  <div className="size-9 rounded-xl bg-emerald-600/90 grid place-items-center shadow">
    <User className="size-5 text-white" />
  </div>
);
