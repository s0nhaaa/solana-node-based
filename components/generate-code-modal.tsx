import { useAppStore } from '@/stores/app'
import { useContextStore } from '@/stores/context'
import { useDataStructureStore } from '@/stores/data-structure'
import { useInstructionStore } from '@/stores/instruction'
import { useProgramStore } from '@/stores/program'
import { PROGRAM_TEMPLATE, generateAccounts, generateContext, generateInstruction } from '@/utils/genrate-code'
import React, { useEffect, useState } from 'react'
import { CopyBlock, dracula } from 'react-code-blocks'

export default function GenerateCodeModal() {
  const [openGenerateCodeModal, setOpenGenerateCodeModal] = useAppStore((state) => [
    state.openGenerateCodeModal,
    state.setOpenGenerateCodeModal,
  ])

  const [dataStructure] = useDataStructureStore((state) => [state.dataStructure])
  const [contexts] = useContextStore((state) => [state.contexts])
  const [programName] = useProgramStore((state) => [state.programName])
  const [instructions] = useInstructionStore((state) => [state.instructions])

  const [code, setCode] = useState('')

  useEffect(() => {
    if (contexts && instructions && dataStructure) {
      const replaced = PROGRAM_TEMPLATE.replace('{{program_name}}', programName)
        .replace('{{instructions}}', generateInstruction(instructions, contexts))
        .replace('{{contexts}}', generateContext(contexts, dataStructure))
        .replace('{{accounts}}', generateAccounts(dataStructure))
      setCode(replaced)
    }
  }, [dataStructure, contexts, programName, instructions])

  return (
    <>
      <input type='checkbox' id='my-modal' className='modal-toggle' />
      <div className={`modal ${openGenerateCodeModal ? 'modal-open' : ''}`}>
        <div className='modal-box w-11/12 max-w-5xl'>
          <h3 className='font-bold text-lg'>Generated program in Rust code</h3>
          <p className='py-4 text-neutral-content'>
            Copy and use finish the <kbd className='kbd'>Instruction</kbd> logic
          </p>
          <div className=' max-h-[60%] overflow-auto'>
            <CopyBlock
              language={'rust'}
              text={code}
              showLineNumbers={true}
              theme={dracula}
              wrapLines={true}
              codeBlock
            />
          </div>
          <div className='modal-action'>
            <button className='btn' onClick={() => setOpenGenerateCodeModal(false)}>
              Yay!
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
