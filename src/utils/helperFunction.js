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
