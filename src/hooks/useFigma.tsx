import axios from "axios";
import { useState } from "react";
// @ts-ignore
import * as figma from "../lib/figma";

const vectorTypes: any = ['VECTOR', 'LINE', 'REGULAR_POLYGON', 'ELLIPSE', 'STAR'];

const api = axios.create({
    baseURL: 'https://api.figma.com',
    headers: {
        "X-Figma-Token": import.meta.env.VITE_FIGMA_TOKEN
    }
})


/**
 *
 * @param fileKey
 */
const useFigma = (fileKey: string) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

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

        console.log(node.type)
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

    const run = async () => {
        try {

            const response: any = await api.get(`/v1/files/${fileKey}`)

            const doc = response.data.document;
            const canvas = doc.children[0]

            let html = '';
            let vector: any;
            for (const child of canvas.children) {
                if (child.name.charAt(0) === '#' && child.visible !== false) {
                    preprocessTree(child)
                }
            }

            // let guids = vector.vectorList.join(',');

            console.log(vectorList)

        } catch (err: any) {
            console.error(err)
        }
    }

    return { run, data }
}


export default useFigma;