import axios from "axios";

export const colorString = (color: any) => {
    return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a})`;
}

export const dropShadow = (effect: any) => {
    return `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${colorString(effect.color)}`;
}

export const innerShadow = (effect: any) => {
    return `inset ${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${colorString(effect.color)}`;
}

export const imageURL = async (hash: any, id: any, fileKey?: string | null) => {
    if (!fileKey) return;

    let url = '';
    const res = await axios.get(`https://api.figma.com/v1/images/${fileKey}?ids=${id}&format=png`, {
        headers: {
            'X-Figma-Token': import.meta.env.VITE_FIGMA_TOKEN
        }
    })
    url = res.data.images[id]
    return `url(${url})`;
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