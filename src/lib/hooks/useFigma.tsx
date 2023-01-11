import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import * as Figma from "../Figma";

import { createJSX } from "../helpers";
import useLocalStorage from "./useLocalStorage";
import FigmaLogin from "../components/FigmaLogin/FigmaLogin";

const vectorTypes: any = ['VECTOR', 'LINE', 'REGULAR_POLYGON', 'ELLIPSE', 'STAR'];

const location = window.location.href.replace(window.location.search, '')
const CLIENT_ID = 'Z70USUDZKrFDMF1DabBe3Y'
const CLIENT_SECRET = 'AATunePpR13fV61pikgCxK0NReiUde'
const REDIRECT_URL = encodeURIComponent(location.substring(0, location.length - 1))
const SCOPE = 'file_read'

const useFigma = () => {
    const [data, setData] = useState(null)
    const [status, setStatus] = useState<any>(null)
    const [error, setError]: any = useState(null)
    const [user, setUser] = useState<any>(null)
    const [fileKey, setFileKey] = useState<any>(null)
    const [canvasMap, setCanvasMap] = useState<any>(null)
    const [frames, setFrames] = useState<any>(null)
    const [selectedFrame, setSelectedFrame] = useState<any>(null)
    const [authToken, setAuthToken] = useLocalStorage('figmaAuthToken')

    const [searchParams, setSearchParams] = useSearchParams()

    let vectorMap: any = {};
    const vectorList: any = [];
    const preprocessTree = (node: any) => {
        let vectorsOnly = node.name.charAt(0) !== '#';
        let vectorVConstraint = null;
        let vectorHConstraint = null;

        function paintsRequireRender (paints: any) {
            if (!paints) return false;

            let numPaints = 0;
            for (const paint of paints) {
                if (!paint.visible) continue;

                numPaints++;
                if (paint.type === 'EMOJI') return true;
            }

            return numPaints > 1;
        }

        if (paintsRequireRender(node.fills) || paintsRequireRender(node.strokes) || (node.blendMode != null && ['PASS_THROUGH', 'NORMAL'].indexOf(node.blendMode) < 0)) {
            node.type = 'VECTOR';
        }

        const children = node.children && node.children.filter((child: any) => child.visible !== false);
        if (children) {
            for (let j = 0; j < children.length; j++) {
                if (vectorTypes.indexOf(children[j].type) < 0) vectorsOnly = false;
                else {
                    if (vectorVConstraint != null && children[j].constraints.vertical != vectorVConstraint) vectorsOnly = false;
                    if (vectorHConstraint != null && children[j].constraints.horizontal != vectorHConstraint) vectorsOnly = false;
                    vectorVConstraint = children[j].constraints.vertical;
                    vectorHConstraint = children[j].constraints.horizontal;
                }
            }
        }
        node.children = children;

        if (children && children.length > 0 && vectorsOnly) {
            node.type = 'VECTOR';
            node.constraints = {
                vertical: vectorVConstraint,
                horizontal: vectorHConstraint,
            };
        }

        if (vectorTypes.indexOf(node.type) >= 0) {
            node.type = 'VECTOR';
            vectorMap[node.id] = node;
            vectorList.push(node.id);
            node.children = [];
        }

        if (node.children) {
            for (const child of node.children) {
                preprocessTree(child);
            }
        }
    }

    const retrieveFiles = useCallback(async (fileKey: any) => {
        setFileKey(fileKey)
        try {
            setStatus('Fetching files...')
            const response: any = await axios.get(`https://api.figma.com/v1/files/${fileKey}`, {
                headers: {
                    Authorization: `Bearer ${authToken.access_token}`
                }
            })

            const doc = response.data.document;
            setCanvasMap(doc.children[0])
            setFrames(doc.children[0].children.map((child: any) => ({ id: child.id, name: child.name })))

        } catch (err: any) {
            setError({ message: err.message, code: err.code });
        }
        setStatus(null)
    }, [fileKey, authToken])

    const run = async (props: any) => {
        try {
            setStatus('Generating structure...')
            let canvas = canvasMap;

            if (selectedFrame) {
                canvas.children = canvasMap.children.filter((child: any) => child.id === selectedFrame)
            }

            console.log(canvas)

            for (let i = 0; i < canvas.children.length; i++) {
                const child = canvas.children[i]
                if (child.name.charAt(0) === '#' && child.visible !== false) {
                    const child = canvas.children[i];
                    preprocessTree(child);
                }
            }

            let images: any;

            if (vectorList.length > 0) {
                let guids = vectorList.join(',');
                const imageJSON: any = await axios.get(`https://api.figma.com/v1/images/${fileKey}?ids=${guids}&format=svg`, {
                    headers: {
                        Authorization: `Bearer ${authToken.access_token}`
                    }
                });
                images = imageJSON.data.images || {};
            }

            if (images) {
                let promises = [];
                let guids = [];
                for (const guid in images) {
                    if (images[guid] == null) continue;
                    guids.push(guid);
                    promises.push(fetch(images[guid]));
                }

                let responses: any = await Promise.all(promises);
                promises = [];
                for (const resp of responses) {
                    promises.push(resp.text());
                }

                responses = await Promise.all(promises);
                for (let i = 0; i < responses.length; i++) {
                    images[guids[i]] = responses[i].replace('<svg ', '<svg preserveAspectRatio="none" ');
                }
            }

            const componentMap: any = {}
            for (const child of canvas.children) {
                if (child.name.charAt(0) === '#' && child.visible !== false) {
                    await Figma.createComponent(child, images, componentMap, fileKey)
                }
            }

            const jsx = createJSX(componentMap[selectedFrame].doc, props)

            setStatus(null)
            setData(jsx)
            setError(null)
            return { jsx, componentMap };

        } catch (err: any) {
            setStatus(null)
            setData(null)
            setError({ message: err.message, code: err.code });
        }
    }

    const authenticate = async (code: string | null) => {
        setStatus('Authenticating...')
        try {
            if (authToken?.accessToken) return;
            const url = `https://www.figma.com/api/oauth/token?` +
                `client_id=${CLIENT_ID}` +
                `&client_secret=${CLIENT_SECRET}` +
                `&redirect_uri=${REDIRECT_URL}` +
                `&scope=${SCOPE}` +
                `&code=${code}` +
                `&grant_type=authorization_code`

            const authResponse = await axios.post(url)
            setAuthToken(authResponse.data)

            searchParams.delete('code')
            searchParams.delete('state')
            setSearchParams(searchParams)

        } catch (err: any) {
            setError({ message: err.message, code: err.code });
        }
        setStatus(null)
    }

    useEffect(() => {

        (async () => {
            setStatus('Fetching User...')
            setUser(null)
            try {
                if (!authToken?.access_token) {
                    setStatus(null)
                    return
                }
                const user = await axios.get('https://api.figma.com/v1/me', {
                    headers: {
                        Authorization: `Bearer ${authToken.access_token}`
                    }
                })
                setUser(user.data)

            } catch (err: any) {
                setAuthToken(null)
                setError({ message: err.message, code: err.code })
            }
            setStatus(null)
        })()

    }, [authToken])

    const renderLogin = useCallback(() => {
        return (
            <>
                {!status &&
                    <FigmaLogin
                        user={user}
                        CLIENT_ID={CLIENT_ID}
                        REDIRECT_URL={REDIRECT_URL}
                        SCOPE={SCOPE}
                    />
                }
            </>
        )
    }, [user, status])

    const figma: any = useMemo(() => {
        return {
            data,
            error,
            status,
            user,
            // authToken,
            fileKey,
            frames,
            selectedFrame,
            run,
            retrieveFiles,
            authenticate,
            setFileKey,
            setSelectedFrame,
            renderLogin,
            get CLIENT_ID () {
                return CLIENT_ID
            },
            get CLIENT_SECRET () {
                return CLIENT_SECRET;
            },
            get REDIRECT_URL () {
                return REDIRECT_URL
            },
            get SCOPE () {
                return SCOPE
            },
            get authToken () {
                return authToken
            },
            get canvas () {
                return canvasMap
            }
        }
    }, [data, error, status, user, fileKey, canvasMap, selectedFrame])

    return figma;
}


export default useFigma;