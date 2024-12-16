export const capitalize = (word: string): string => word.substring(0, 1).toUpperCase() + word.substring(1);

export const decapitalize = (word: string):string => word.substring(0, 1).toLowerCase() + word.substring(1);

const capsRegex = /[A-Z]/;

export const splitCamelCaseToWords = {
    [Symbol.split](str: string) {
        const result: string[] = [];
        let matchPos = str.search(capsRegex);
        while (true) {
            if (matchPos === -1) {
                result.push(capitalize(str));
                break;
            }
            result.push(capitalize(str.substring(0, matchPos)));
            str = decapitalize(str.substring(matchPos));
            matchPos = str.search(capsRegex);
        }
        return result;
    }
};

const indefiniteArticleStartRegex = /^(the|a|an)\s/i;

export const titleSort = (a: string, b: string): number => {
    const loweredA = a.toLowerCase();
    const unindefiniteArticledA = loweredA.replace(indefiniteArticleStartRegex, '');
    const loweredB = b.toLowerCase();
    const unindefiniteArticledB = loweredB.replace(indefiniteArticleStartRegex, '');

    if (unindefiniteArticledA < unindefiniteArticledB) {
        return -1;
    } else if (unindefiniteArticledB < unindefiniteArticledA) {
        return 1;
    }
    return 0;
};
