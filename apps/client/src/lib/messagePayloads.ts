export type MessagePayload =
  | { message: "REALTIME_CODE"; data: string }
  | { message: "LANGUAGE_UPDATE"; data: { id: number; lang: string } }
  | { message: "ALLOW_EDIT"; data: boolean }
  | {
      message: "REGISTER_SHARER";
      data: {
        userId: string;
        userName: string;
        initialCode: string;
        languageSelected: { id: number; lang: string };
      };
    }
  | {
      message: "REGISTER_VIEWER";
      data: { userId: string; userName: string; watchId: string };
    }
  | { message: string; data: string };
