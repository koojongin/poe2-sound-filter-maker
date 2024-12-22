declare global {
    interface Window {
        electron: {
            openFileDialog: () => Promise<string[]>;
        };
    }
}

export {};  // 이 파일을 모듈로 취급하려면 export를 추가합니다.
