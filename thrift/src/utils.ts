export const getRandomValue = (len: number = 36) => {
    var arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (dec) => dec.toString(16).padStart(2, "0")).join("");
};

export const getNewProjectName = (existingProjectNames: string[]): string => {
    const NEW_PROJECT = "New Project";
    if (!existingProjectNames.includes(NEW_PROJECT)) {
        return NEW_PROJECT;
    }

    for (let i = 2; i < 1000; i++) {
        const newName = `${NEW_PROJECT} ${i}`;
        if (!existingProjectNames.includes(newName)) {
            return newName;
        }
    }

    return "aaaaaaaaaa";
};

export const range = (start: number, end: number) => {
    const min = Math.min(start, end);
    const max = Math.max(start, end);
    const arr = [];
    for (let i = min; i <= max; i++) {
        arr.push(i);
    }
    return arr;
}
