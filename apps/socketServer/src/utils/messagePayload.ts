export type MessagePayload =
  | { message: "REALTIME_CODE"; data: string }
  | { message: "REGISTER_VIEWER"; data: { userId: string; userName: string; watchId: string } }
  | { message: "REGISTER_SHARER"; data: { userId: string; userName: string; initialCode: string } }
  | { message: "ALLOW_EDIT"; data: boolean };

export const isMessagePayload = (obj: any): obj is MessagePayload => {
  return typeof obj?.message === "string" && "data" in obj;
};
