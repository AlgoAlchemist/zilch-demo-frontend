import { Card } from './Card'
import { FC, useEffect, useMemo, useState } from 'react'
import { Prog } from '../models/prog'
import * as web3 from '@solana/web3.js'
import { ProgCoordinator } from '../coordinators/ProgCoordinator'
import { Button, Center, HStack, Input, Spacer } from '@chakra-ui/react'

export const ProgList: FC = () => {
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    const [progs, setProgs] = useState<Prog[]>([])
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')

    useEffect(() => {
        ProgCoordinator.fetchPage(
            connection, 
            page, 
            5,
            search,
            search !== ''
        ).then(setProgs)
    }, [page, search])
    
    return (
        <div>
            <Center>
                <Input
                    id='search'
                    color='gray.400'
                    onChange={event => setSearch(event.currentTarget.value)}
                    placeholder='Search'
                    w='97%'
                    mt={2}
                    mb={2}
                />
            </Center>
            {
                progs.map((prog, i) => <Card key={i} prog={prog} /> )
            }
            <Center>
                <HStack w='full' mt={2} mb={8} ml={4} mr={4}>
                    {
                        page > 1 && <Button onClick={() => setPage(page - 1)}>Previous</Button>
                    }
                    <Spacer />
                    {
                        ProgCoordinator.accounts.length > page * 5 &&
                        <Button onClick={() => setPage(page + 1)}>Next</Button>
                    }
                </HStack>
            </Center>
        </div>
    )
}