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

    async generateEmbedding(apiKey: string) {
        const response = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: this.content
        })
        });

        const data = await response.json();
        this.embedding = data.data[0].embedding;
    }
}

export function createNote(title: string, path: string){
    const note = new Note(title, path);
    return note.id;
}

export function cosineSimilarity(a: number[], b: number[]): number { const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (magA * magB);
}
