export const blockFactory: <T>(classEntity: new () => T) => T = (
    classEntity
) => {
    return new classEntity();
};
