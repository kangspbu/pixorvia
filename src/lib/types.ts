export type UploadAuthResponseType = {
  signature: string;
  expire: number;
  token: string;
  publicKey: string;
};

export type CreateProjectType = {
  imageUrl: string;
  imageKitId: string;
  filePath: string;
  name?: string;
};

export type UploadedImageType = {
  fileId: string;
  filePath: string;
  url: string;
  name: string;
};

export type ProjectType = {
  id: string;
  name: string | null;
  imageUrl: string;
  imageKitId: string;
  filePath: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};
export type Transformation = {
  aiRemoveBackground?: true;
  aiUpscale?: true;
  raw?: string;
};
