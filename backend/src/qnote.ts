import { z } from "zod";
import { END, START, StateGraph, Annotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import prompt from "./prompt";

const model = new ChatOpenAI({ model: "gpt-4o" });

interface IAssessment {
    summary: string;
    suggestionsForImprovement: string;
    chiefComplaint: number;
    historyOfPresentIllness: number;
    pastMedicalHistory: number;
    allergiesAndAdverseDrugReactions: number;
    physicalFindings: number;
    assessment: number;
    planOfCare: number;
    followUpInstructions: number;
}

const assessmentSchema = z.object({
    summary: z.string(),
    suggestionsForImprovement: z.string(),
    chiefComplaint: z.number(),
    historyOfPresentIllness: z.number(),
    pastMedicalHistory: z.number(),
    allergiesAndAdverseDrugReactions: z.number(),
    physicalFindings: z.number(),
    assessment: z.number(),
    planOfCare: z.number(),
    followUpInstructions: z.number(),
});

const AppState = Annotation.Root({
    assessment: Annotation<IAssessment>(),
    clinicalNotes: Annotation<string>(),
});

const qnoteAdvisor = async (state: typeof AppState.State) => {
    const instruction = prompt.replace("{{clinicalNotes}}", state.clinicalNotes);

    const response = await model.withStructuredOutput(assessmentSchema).invoke(instruction);

    return { assessment: response };
};

// ✅ Build the LangGraph state machine
const graph = new StateGraph(AppState)
    .addNode("qnoteAdvisor", qnoteAdvisor)
    .addEdge(START, "qnoteAdvisor")
    .addEdge("qnoteAdvisor", END);

// ✅ Chat processing function
export const processQNote = async (clinicalNotes: string) => {
    const app = graph.compile();
    const result = await app.invoke({ clinicalNotes });
    return result;
};
