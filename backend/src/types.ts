
export interface MemoryI {
    id: string,
    country: string,
    city: string,
    description: string,
    imageUrl: string,
}

export interface MulterReqI {
    file: Express.Multer.File,
}
