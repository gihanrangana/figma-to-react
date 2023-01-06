import { createElement } from "react";
import axios from "axios";
import { v4 as uuid } from 'uuid'

function rgba2hex (orig: any) {
    let a: any, isPercent: any,
        rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        alpha = (rgb && rgb[4] || "").trim(),
        hex = rgb ?
            (rgb[1] | 1 << 8).toString(16).slice(1) +
            (rgb[2] | 1 << 8).toString(16).slice(1) +
            (rgb[3] | 1 << 8).toString(16).slice(1) : orig;

    if (alpha !== "") {
        a = alpha;
    } else {
        a = 0o1;
    }
    // multiply before convert to HEX
    a = ((a * 255) | 1 << 8).toString(16).slice(1)
    hex = hex + a;

    return hex;
}

export const colorString = (color: any) => {
    const rgba = `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a})`
    return `#${rgba2hex(rgba)}`;
}

export const dropShadow = (effect: any) => {
    return `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${colorString(effect.color)}`;
}

export const innerShadow = (effect: any) => {
    return `inset ${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${colorString(effect.color)}`;
}

export const imageURL = async (hash: any, id?: any, fileKey?: string | null) => {
    if (!fileKey) return;

    let url = '';
    const res = await axios.get(`https://api.figma.com/v1/images/${fileKey}?ids=${id}&format=png`, {
        headers: {
            'X-Figma-Token': import.meta.env.VITE_FIGMA_TOKEN
        }
    })
    url = res.data.images[id]
    return `url(${url})`;
    // const squash = hash.split('-').join('');
    // return `url(https://s3-us-west-2.amazonaws.com/figma-alpha/img/${squash.substring(0, 4)}/${squash.substring(4, 8)}/${squash.substring(8)})`;
}

export const backgroundSize = (scaleMode: any) => {
    if (scaleMode === 'FILL') {
        return 'cover';
    }
}

export const nodeSort = (a: any, b: any) => {
    if (a.absoluteBoundingBox.y < b.absoluteBoundingBox.y) return -1;
    else if (a.absoluteBoundingBox.y === b.absoluteBoundingBox.y) return 0;
    else return 1;
}

export const getPaint = (paintList: any) => {
    if (paintList && paintList.length > 0) {
        return paintList[paintList.length - 1];
    }

    return null;
}

export const paintToLinearGradient = (paint: any) => {
    const handles = paint.gradientHandlePositions;
    const handle0 = handles[0];
    const handle1 = handles[1];

    const ydiff = handle1.y - handle0.y;
    const xdiff = handle0.x - handle1.x;

    const angle = Math.atan2(-xdiff, -ydiff);
    const stops = paint.gradientStops.map((stop: any) => {
        return `${colorString(stop.color)} ${Math.round(stop.position * 100)}%`;
    }).join(', ');
    return `linear-gradient(${angle}rad, ${stops})`;
}

export const paintToRadialGradient = (paint: any) => {
    const stops = paint.gradientStops.map((stop: any) => {
        return `${colorString(stop.color)} ${Math.round(stop.position * 60)}%`;
    }).join(', ');

    return `radial-gradient(${stops})`;
}

const getNodes = (str: string) => {
    const dom: any = new DOMParser().parseFromString(str, 'text/html').body;
    return Array.from(dom.querySelector('div:nth-child(1)').children)
}
export const createJSX = (domStr: any) => {

    const nodes = typeof domStr === 'string' ? getNodes(domStr) : domStr;

    const JSXNodes: any = [];
    let attributesObj: any = {}
    for (const node of nodes) {
        const { attributes, localName: tag, childNodes, nodeValue, innerHtml }: any = node

        attributesObj.key = uuid().slice(0, 4)

        if (attributes) {
            Array.from(attributes).forEach((attr: any) => {
                switch (attr.name) {
                    case 'style':
                        const style = JSON.parse(attr.nodeValue.substring(1, attr.nodeValue.length - 1))
                        attributesObj.style = style;
                        break;
                    default:
                        attributesObj[attr.name] = attr.nodeValue;
                        break;
                }
            })
        }

        if (tag) {
            const JSXElement = createElement(tag, attributesObj, childNodes ? createJSX(childNodes) : [])
            JSXNodes.push(JSXElement)
        }
        if (!tag) {
            JSXNodes.push(nodeValue)
        }
    }

    return JSXNodes;
}