export function getTokenFromLocalStorage() : string {
    const data = localStorage.getItem('accessToken');
    return data && data !== 'undefined' ? JSON.parse(data) : '';
}

export function setTokenToLocalStorage(token: string) : void {
    localStorage.setItem('accessToken', JSON.stringify(token));
}

export function removeTokenFromLocalStorage() : void {
    localStorage.removeItem('accessToken');
}