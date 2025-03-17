import { z } from "zod";
import { END, START, StateGraph, Annotation, Command, messagesStateReducer, InMemoryStore, MemorySaver } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, BaseMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

const inMemoryStore = new InMemoryStore();

const checkpointer = new MemorySaver();

const AppState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer: messagesStateReducer,
        default: () => [],
    }),
});

const travelAdvisor = async (state: typeof AppState.State) => {
    const possibleDestinations = ["__end__", "hotelAdvisor", "sightseeingAdvisor"] as const;

    const responseSchema = z.object({
        response: z.string().describe(
            "A human readable response to the original question. Does not need to be a final response. Will be streamed back to the user."
        ),
        goto: z.enum(possibleDestinations).describe("The next agent to call, or __end__ if the user's query has been resolved. Must be one of the specified values."),
    });

    const instruction = `
        You are a general travel expert that can recommend travel destinations (e.g. countries, cities, etc).
        If you need specific sightseeing recommendations, ask 'sightseeing_advisor' for help.
        If you need hotel recommendations, ask 'hotel_advisor' for help.
        If you have enough information to respond to the user, return '__end__'.
        Never mention other agents by name.
    `;

    const messages = [
        new SystemMessage({ content: instruction }),
        ...state.messages,
    ];

    const response = await model.withStructuredOutput(responseSchema, { name: "router" }).invoke(messages);

    return new Command({
        goto: response.goto,
        update: { messages: new AIMessage({ content: response.response, name: "travelAdvisor" }) }
    });
};


const hotelAdvisor = async (state: typeof AppState.State) => {
    const possibleDestinations = ["__end__", "travelAdvisor", "sightseeingAdvisor"] as const;

    const responseSchema = z.object({
        response: z.string().describe(
            "A human readable response to the original question. Does not need to be a final response. Will be streamed back to the user."
        ),
        goto: z.enum(possibleDestinations).describe("The next agent to call, or __end__ if the user's query has been resolved. Must be one of the specified values."),
    });

    const instruction = `
        You are a booking expert that provides hotel recommendations for a given destination.
        If you need general travel help, ask 'travel_advisor' for help.
        If you need specific sightseeing recommendations, ask 'sightseeing_advisor' for help.
        If you have enough information to respond to the user, return 'finish'.
        Never mention other agents by name.
    `;

    const messages = [
        new SystemMessage({ content: instruction }),
        ...state.messages,
    ];

    const response = await model.withStructuredOutput(responseSchema, { name: "router" }).invoke(messages);

    return new Command({
        goto: response.goto,
        update: { messages: new AIMessage({ content: response.response, name: "hotelAdvisor" }) }
    });
};

const sightseeingAdvisor = async (state: typeof AppState.State) => {
    const possibleDestinations = ["__end__", "hotelAdvisor", "travelAdvisor"] as const;

    const responseSchema = z.object({
        response: z.string().describe(
            "A human readable response to the original question. Does not need to be a final response. Will be streamed back to the user."
        ),
        goto: z.enum(possibleDestinations).describe("The next agent to call, or __end__ if the user's query has been resolved. Must be one of the specified values."),
    });

    const instruction = `
        You are a travel expert that can provide specific sightseeing recommendations for a given destination.
        If you need general travel help, go to 'travel_advisor' for help.
        If you need hotel recommendations, go to 'hotel_advisor' for help.
        If you have enough information to respond to the user, return 'finish'.
        Never mention other agents by name.
    `;

    const messages = [
        new SystemMessage({ content: instruction }),
        ...state.messages,
    ];

    const response = await model.withStructuredOutput(responseSchema, { name: "router" }).invoke(messages);

    return new Command({
        goto: response.goto,
        update: { messages: new AIMessage({ content: response.response, name: "sightseeingAdvisor" }) }
    });
};

// ✅ Build the LangGraph state machine
const graph = new StateGraph(AppState)
    .addNode("travelAdvisor", travelAdvisor, { ends: ["sightseeingAdvisor", "hotelAdvisor", END] })
    .addNode("sightseeingAdvisor", sightseeingAdvisor, { ends: ["travelAdvisor", "hotelAdvisor", END] })
    .addNode("hotelAdvisor", hotelAdvisor, { ends: ["travelAdvisor", "sightseeingAdvisor", END] })
    .addEdge(START, "travelAdvisor");

// ✅ Chat processing function
export const processChat = async (messages: BaseMessage[], sessionId: string) => {

    const user_id = "u1233";
    const config = { configurable: { "thread_id": sessionId, user_id } };

    const app = graph.compile({
        checkpointer,
        store: inMemoryStore,
    });

    const result = await app.invoke({ messages }, config);

    return result;
};
