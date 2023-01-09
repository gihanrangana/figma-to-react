export const openWindow = (url: string, name: string) => {
    const top = (window.innerHeight - 600) / 2 + window.screenY;
    const left = (window.innerWidth - 600) / 2 + window.screenX;

    return window.open(url, name, `dialog=yes,top=${top},left=${left},width=${550}px,height=${700}px`)
}

interface ObserveWindowParams {
    popup: Window,
    onClose: () => void,
    interval?: number
}

export const observeWindow = ({ popup, onClose, interval }: ObserveWindowParams) => {
    const intervalId = setInterval(() => {
        if (popup.closed) {
            clearInterval(intervalId);
            onClose();
        }
    }, interval || 100)
}