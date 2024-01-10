import { ReplaceVariable } from "../../../../types/variables";
import { OutputDataType, VariableCategory } from "../../../../shared/variable-constants";
import { convertToString } from '../../../utility';

const model : ReplaceVariable = {
    definition: {
        handle: "trimStart",
        description: "Removes any whitespace from the beginning of input text.",
        usage: "trim[text]",
        categories: [VariableCategory.TEXT],
        possibleDataOutput: [OutputDataType.TEXT]
    },
    evaluator: (_: unknown, subject: unknown) : string => {
        if (subject == null) {
            return '';
        }
        return convertToString(subject).trimStart();
    }
};

export default model;
