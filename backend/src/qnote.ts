import { z } from "zod";
import { END, START, StateGraph, Annotation } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import prompt from "./prompt";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });


const AppState = Annotation.Root({
    assessment: Annotation<string>(),
    clinicalNotes: Annotation<string>(),
});

const qnoteAdvisor = async (state: typeof AppState.State) => {
    const instruction = prompt.replace("{{clinicalNotes}}", state.clinicalNotes);

    const response = await model.invoke(instruction);

    return { assessment: response.content };
};

// ✅ Build the LangGraph state machine
const graph = new StateGraph(AppState)
    .addNode("qnoteAdvisor", qnoteAdvisor)
    .addEdge(START, "qnoteAdvisor")
    .addEdge("qnoteAdvisor", END);

// ✅ Chat processing function
export const processQNote = async (clinicalNotes: string) => {
    const app = graph.compile();

    console.log("Clinical Notes:", clinicalNotes);

    const result = await app.invoke({ clinicalNotes });

    return result;
};
