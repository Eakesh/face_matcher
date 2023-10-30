export type ImageUploaderState = {
    image: string | null;
    source: string | null;
    modalIsOpen: boolean;
};

const defaultState: ImageUploaderState = {
    image: null,
    source: null,
    modalIsOpen: false,
};

export {defaultState};