import React, {useCallback, useEffect, useState} from "react";

export default function MakerPage() {

    const [textData, setTextData] = useState<string>()
    const [soundTexts, setSoundTexts] = useState<string[]>([])
    const [filePath, setFilePath] = useState<string>()

    const [uniqSounds, setUniqSounds] = useState<string[]>()
    const [customSounds, setCustomSounds] = useState<string[]>()

    const [soundMap, setSoundMap] = useState<{ [key: string]: string }>({})

    const getFilePath = async () => {
        const fileFullPath = await window.electron.openFileDialog()
        setFilePath(fileFullPath)
    }

    const openFileSelector = async (beforePath: string) => {
        const fileFullPath = await window.electron.openFileDialog()
        if (!fileFullPath) return
        setSoundMap({...soundMap, [beforePath]: fileFullPath})
    }

    const handleChangeFile = useCallback(async () => {
        const text = await window.electron.readFileContent(filePath);
        setTextData(text)
    }, [filePath])

    const playAudio = (filePath) => {
        const audio = new Audio(filePath);
        audio.volume = 0.5
        audio.play().catch((error) => {
            console.error("Error playing audio:", error);
        });
    }

    const onClickPlayButton = (name: string) => {
        const path = [...filePath.split("\\").slice(0, -1), name].join("\\")
        playAudioByFilePath(path)
    }

    const playAudioByFilePath = (path: string) => {
        playAudio(path)
    }

    const convertTextData = async () => {
        const lines = textData.split('\n');
        const outputLines = [];

        lines.forEach(line => {
            const trimmedLine = line.trimStart()
            if (trimmedLine.startsWith("CustomAlertSound")) {
                const [firstWord, ...rest] = trimmedLine.split(' ');
                const lastWord = rest.pop()
                const middleWord = rest.join(' ').slice(1, -1)
                const willChangedWord = soundMap[middleWord]
                if (!willChangedWord) {
                    return outputLines.push(trimmedLine);
                }
                outputLines.push(`#Removed#${trimmedLine.trim()}`);
                return outputLines.push(`${firstWord} "${soundMap[middleWord].split('\\').pop()}" ${lastWord}`);
            }

            if (trimmedLine.startsWith("PlayAlertSound")) {
                const [firstWord, soundNumber, volume] = trimmedLine.split(' ');
                const lastWord = volume
                const middleWord = soundNumber
                const willChangedWord = soundMap[middleWord]
                if (!willChangedWord) {
                    return outputLines.push(trimmedLine);
                }
                outputLines.push(`#Removed#${trimmedLine.trim()}`);
                return outputLines.push(`CustomAlertSound "${soundMap[middleWord].split('\\').pop()}" ${lastWord}`);
            }
            outputLines.push(trimmedLine);
        });

        const changedText = outputLines.join('\n');

        const isSaved = await window.electron.saveFileDialog({content: changedText})
        if (isSaved)
            alert("저장되었습니다~")
    }

    const saveFilter = async () => {
        const changedKeys = Object.keys(soundMap)
        if (changedKeys.length === 0)
            return alert("변경된 사운드가 없습니다.")
        await convertTextData()
    }


    useEffect(() => {
        handleChangeFile()
    }, [filePath])

    useEffect(() => {
        if (!textData) return
        console.log(textData)
        const sounds = textData.split('\n').filter((textLine) => {
            const trimmedLine = textLine.trimStart()
            return trimmedLine.indexOf('PlayAlertSound') == 0 || trimmedLine.indexOf('CustomAlertSound') == 0
        }).map(line => line.trimStart())
        console.log(sounds)
        setSoundTexts(sounds)

        const playAlertSoundArr = [];
        const customAlertSoundArr = [];

        const lines = textData.split('\n');
        lines.forEach((line) => {
            const words = line.trim().split(' ');

            if (words.length < 2) return;

            const command = words[0];
            const secondValue = words[1];

            if (command === 'PlayAlertSound') {
                playAlertSoundArr.push(secondValue);
            } else if (command === 'CustomAlertSound') {
                customAlertSoundArr.push(secondValue);
            }
        });

        setUniqSounds([...new Set(playAlertSoundArr)])
        setCustomSounds([...new Set(customAlertSoundArr)]);

        return;
    }, [textData])

    return (
        <div className={'p-[10px]'}>
            <div className="title-text">필터 파일은 원래 사용하던 위치(Poe2 필터폴더)에 두고 열어주세요(그래야 사운드 미리듣기 가능)</div>
            <button className={'bg-gray-800 text-white px-[4px] rounded shadow shadow-gray-500'}
                    onClick={() => getFilePath()}>필터 파일 열기
            </button>

            <div className={'mb-[10px]'}></div>
            {/*사운드 없을때*/}
            {filePath && !soundTexts[0] && <div>
                <div>사운드 설정이 포함되지 않은 필터입니다.</div>
                {filePath &&
                    <div className={'p-[2px] border border-gray-600 text-gray-600'}>{filePath.split('\\').pop()}</div>}
            </div>}

            {/*사운드 있을떄*/}
            {soundTexts[0] && <div>
                {filePath &&
                    <div className={'p-[2px] border border-gray-600 text-gray-600'}>{filePath.split('\\').pop()}</div>}
                {!!soundTexts[0] && <div>{soundTexts.length.toLocaleString()}개의 설정된 사운드 효과 발견됨</div>}

                <div>
                    <div className={'flex gap-[4px] p-[4px] font-bold'}>
                        <div className={'w-[200px]'}>기존 이름</div>
                        <div className={'min-w-[30px]'}/>
                        <div>변경할 사운드</div>
                    </div>
                    <div className={'p-[4px] flex flex-col gap-[4px] border border-gray-300 rounded'}>
                        {uniqSounds.map((name) => {
                            const changedSoundPath = soundMap[name] || '';
                            const changedSoundFile = changedSoundPath.split('\\').pop()
                            return <div className={'flex items-center gap-[4px]'}>
                                <input className={'bg-gray-100 border border-gray-200 w-[200px]'} value={name}/>
                                <div className={'cursor-pointer min-w-[30px]'}></div>
                                <div
                                    className={'bg-gray-800 text-white px-[4px] rounded shadow shadow-gray-500 cursor-pointer'}
                                    onClick={() => openFileSelector(name)}>파일선택
                                </div>
                                {changedSoundPath && <><input className={'bg-gray-100 border border-gray-200 w-[200px]'}
                                                              value={changedSoundFile}/>
                                    <div className={'cursor-pointer min-w-[30px]'}
                                         onClick={() => playAudioByFilePath(changedSoundPath)}>▶
                                    </div>
                                </>}
                            </div>
                        })}
                        {customSounds.map((name) => {
                            const changedSoundPath = soundMap[name.slice(1, -1)] || '';
                            const changedSoundFile = changedSoundPath.split('\\').pop()
                            return <div className={'flex items-center gap-[4px]'}>
                                <input className={'bg-gray-100 border border-gray-200 w-[200px]'}
                                       value={name.slice(1, -1)}/>
                                <div className={'cursor-pointer min-w-[30px]'}
                                     onClick={() => onClickPlayButton(name.slice(1, -1))}>▶
                                </div>
                                <div
                                    className={'bg-gray-800 text-white px-[4px] rounded shadow shadow-gray-500 cursor-pointer'}
                                    onClick={() => openFileSelector(name.slice(1, -1))}>파일선택
                                </div>
                                {changedSoundPath && <><input className={'bg-gray-100 border border-gray-200 w-[200px]'}
                                                              value={changedSoundFile}/>
                                    <div className={'cursor-pointer min-w-[30px]'}
                                         onClick={() => playAudioByFilePath(changedSoundPath)}>▶
                                    </div>
                                </>}
                            </div>
                        })}
                    </div>
                </div>
                <div className={"mb-[10px]"}/>
                <div
                    className={'border border-blue-400 shadow shadow-blue-300 rounded bg-blue-400 text-white font-bold cursor-pointer flex items-center justify-center p-[10px] px-[15px]'}
                    onClick={() => saveFilter()}>변경된
                    파일
                    저장하기
                </div>
                {/*<div className={'border border-gray-300 rounded p-[4px]'}>*/}
                {/*    <div>설정 로그</div>*/}
                {/*    <div*/}
                {/*        className={'text-[14px] border border-gray-300 rounded max-h-[150px] bg-gray-100 overflow-y-scroll flex flex-col gap-[4px]'}>*/}
                {/*        {soundTexts.map((text) => {*/}
                {/*            return <div className={'border-b border-b-gray-300 px-[4px]'}>{text}</div>*/}
                {/*        })}*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>}
        </div>
    );
}
