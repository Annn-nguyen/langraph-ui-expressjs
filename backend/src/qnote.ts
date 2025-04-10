import { z } from "zod";
import { END, START, StateGraph, Annotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import prompt from "./prompt";

const model = new ChatOpenAI({ model: "gpt-4o" });

interface IAssessment {
    summary: string;
    suggestionsForImprovement: string;
    chiefComplaintAndHPI: number;
    pastMedicalHistory: number;
    allergiesAndAdverseDrugReactions: number;
    physicalFindings: number;
    assessment: number;
    planOfCare: number;
    followUpInstructions: number;
    problemList: number;
    medicationList: number;
    socialAndFamilyHistory: number;
    reviewOfSystems: number;
}

const assessmentSchema = z.object({
    summary: z.string(),
    suggestionsForImprovement: z.string(),
    chiefComplaintAndHPI: z.number(),
    pastMedicalHistory: z.number(),
    allergiesAndAdverseDrugReactions: z.number(),
    physicalFindings: z.number(),
    assessment: z.number(),
    planOfCare: z.number(),
    followUpInstructions: z.number(),
    problemList: z.number(),
    medicationList: z.number(),
    socialAndFamilyHistory: z.number(),
    reviewOfSystems: z.number(),
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
