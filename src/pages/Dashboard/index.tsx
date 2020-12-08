import React, { useState, useEffect ,FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import logoImg from '../../assets/img/Logo.svg';

import { Title, Form, Repositories, Error } from './styles'

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;  
        avatar_url: string;
    }
}

const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setinputError] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storagedRepositories = localStorage.getItem('@GithubExpolorer:repositories');

        if(storagedRepositories) {
            return JSON.parse(storagedRepositories);
        }

        return [];
    });

    useEffect(() => {
        localStorage.setItem('@GithubExpolorer:repositories', JSON.stringify(repositories));
    }, [repositories]);

    async function handleAddRepository(
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        if(!newRepo){
            setinputError('Digite o autor/nome do repositório');
            return;
        }
        try{
        const response = await api.get(`repos/${newRepo}`);

        const repository = response.data;

        setRepositories([...repositories,repository]);
        setNewRepo('');
        setinputError('');
        }catch(err){
            setinputError('Erro na busca do repositório');
        }
    };

    return (
        <>
            <img src={logoImg} alt="Github Explorer"/>
            <Title>Explore repositórios no Github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input 
                    value={newRepo}
                    onChange={e => setNewRepo(e.target.value)}
                type="text" placeholder="Digite o nome do repositório"/>
                <button>PESQUISAR</button>
            </Form>
    {inputError && <Error>{inputError}</Error>} 
            <Repositories>
                {repositories.map(repository => (
                <Link key={repository.full_name} to={`/repositories/${repository.full_name}`}>
                    <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
                    <div>
                        <strong>
                         {repository.full_name}
                        </strong>
                        <p>{repository.description}</p>
                    </div>
                    <FiChevronRight size={20}></FiChevronRight>
                </Link>
                ))}
            </Repositories>
        </>
    );
};

export default Dashboard;