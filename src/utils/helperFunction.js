import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

export const getFormatedDate = (timestamp) => {
    if (typeof timestamp !== "number" || isNaN(timestamp)) {
        return "Invalid timestamp";
    }

    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
        return "Invalid date";
    }

    const now = new Date();
    const today = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const targetDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

    const isToday = today.getDate() === targetDate.getDate() && today.getMonth() === targetDate.getMonth() && today.getFullYear() === targetDate.getFullYear();

    if (isToday) {
        // Return only time
        return date.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    // Return full date + time
    return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

export const deriveKey = async (password, salt) => {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
    const key = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: enc.encode(salt),
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    return key;
};

export const encryptPrivateKey = async (privateKeyStr, password, salt) => {
    const key = await deriveKey(password, salt);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const enc = new TextEncoder();
    const ciphertext = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv,
        },
        key,
        enc.encode(privateKeyStr)
    );

    return {
        encrypted: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
        iv: btoa(String.fromCharCode(...iv)),
    };
};

export const decryptPrivateKey = async (encryptedStr, ivStr, password, salt) => {
    const key = await deriveKey(password, salt);

    const dec = new TextDecoder();
    const encrypted = Uint8Array.from(atob(encryptedStr), (c) => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(ivStr), (c) => c.charCodeAt(0));

    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv,
        },
        key,
        encrypted
    );

    return dec.decode(decrypted);
};

export const uint8ArrayToBase64 = (uint8Array) => {
    return btoa(String.fromCharCode(...uint8Array));
};

export const base64ToUint8Array = (base64) => {
    const binary = atob(base64);
    return Uint8Array.from([...binary].map((c) => c.charCodeAt(0)));
};

export const encryptMsg = (text, userPublicKey, userPrivateKey) => {
    const message = naclUtil.decodeUTF8(text);
    const nonce = nacl.randomBytes(nacl.box.nonceLength);
    const encryptedMsg = nacl.box(message, nonce, new Uint8Array(userPublicKey.split(",").map(Number)), new Uint8Array(userPrivateKey.split(",").map(Number)));
    return { encryptedMsg, nonce };
};

export const decryptMsg = (encryptedMsg, nonce, userPublicKey, userPrivateKey) => {
    const decrypted = nacl.box.open(encryptedMsg, nonce, new Uint8Array(userPublicKey.split(",").map(Number)), new Uint8Array(userPrivateKey.split(",").map(Number)));
    const decryptedMsg = naclUtil.encodeUTF8(decrypted);
    return decryptedMsg;
};
