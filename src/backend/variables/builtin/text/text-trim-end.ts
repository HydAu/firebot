import { ReplaceVariable } from "../../../../types/variables";
import { OutputDataType, VariableCategory } from "../../../../shared/variable-constants";
import { convertToString } from '../../../utility';

const model : ReplaceVariable = {
    definition: {
        handle: "trimEnd",
        description: "Removes any whitespace from the end of input text.",
        usage: "trimEnd[text]",
        categories: [VariableCategory.TEXT],
        possibleDataOutput: [OutputDataType.TEXT]
    },
    evaluator: (_: unknown, subject: unknown) : string => {
        if (subject == null) {
            return '';
        }
        return convertToString(subject).trimEnd();
    }
};

export default model;
