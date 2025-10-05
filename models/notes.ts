export class Note {
    id: string;
    title: string;
    createdAt: number;

    lastUpdate: number;
    folderID?: string;
    words: number;

    embedding: number[] = [];
    sites: string[] = [];

    content: string = "";

    constructor(title: string, folderID?: string){
        this.title = title.trim();
        this.id = crypto.randomUUID();
        this.createdAt = Date.now();
        this.lastUpdate = Date.now();
        this.words = 0;

        if (folderID){
            this.folderID = folderID;
            this.save(folderID);
        }
    }

    async save(folderID: string){
        if (!this.folderID){
            throw new Error("Missing Path")
        }

        await chrome.storage.local.set({
            [`${folderID}/meta_${this.id}`]: {
                id: this.id,
                title: this.title,
                createdAt: this.createdAt,
                lastUpdate: this.lastUpdate,
                words: this.words,
                embedding: this.embedding,
                sites: this.sites,
            }
        });

        this.folderID = folderID;

        await chrome.storage.local.set({
            [`${folderID}/content_${this.id}`]: this.content
        });       
    }

    async getMeta() {
        const result = await chrome.storage.local.get(`${this.folderID}/meta_${this.id}`);
        return result[`${this.folderID}/meta_${this.id}`];
    }
    async getContent() {
        const result = await chrome.storage.local.get(`${this.folderID}/content_${this.id}`);
        return result[`${this.folderID}/content_${this.id}`];
    }

    async delete() {
        await chrome.storage.local.remove([
            `${this.folderID}/meta_${this.id}`,
            `${this.folderID}/content_${this.id}`
        ]);
    }

    update(content: string){
        this.lastUpdate = Date.now();
        this.content = content;
        
        this.words = content.trim().split(/\s+/).length;

        if (this.folderID){
            this.save(this.folderID);
        }else throw new Error("Missing Path");
    }
}

export function addNote(title: string, path: string){
    const note = new Note(title, path);
    return note.id;
}
