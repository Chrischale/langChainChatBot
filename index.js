import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

try {
  const result = await fetch('doc-info.txt')
  const text = await result.text()

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500, //default is 1000, this overrides the default
    separators: ['\n\n', '\n', ' ', ''], // default setting
    chunkOverlap: 50 //defaults to 200 - good rule of thumb to start with is 10% of your chunk size
  })

  const output = await splitter.createDocuments([text])
  console.log(output)

  //hooking up our supabase vector store:

//move these to ENV variables in process.env.SUPABASEAPIKEY
const supabaseAPIKey = ENV.SUPABASE_APIKEY
const supabaseURL = ENV.SUPABASE_URL
const openAPIKey = ENV.OPENAI_API_KEY



//set up a supabase client 
const client = createClient(supabaseURL, supabaseAPIKey)

// 2 things: create emebeddings and upload them to vector store
await SupabaseVectorStore.fromDocuments(
  output,
  new OpenAIEmbeddings({openAPIKey}),
  {
    client,
    tableName: 'documents'
  }
)

} catch (err) {
  console.log(err)
}