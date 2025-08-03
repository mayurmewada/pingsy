export const getFormatedDate = (timestamp) => {
    if (typeof timestamp !== "number" || isNaN(timestamp)) {
        return "Invalid timestamp";
    }

    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
        return "Invalid date";
    }

    // Create a new date object for today in IST
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
}

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
}