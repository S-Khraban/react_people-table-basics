import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import cn from 'classnames';
import { getPeople } from '../api';
import type { Person } from '../types/Person';
import { Loader } from '../components/Loader';
import { PeopleTable } from '../components/PeopleTable';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export const PeoplePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [people, setPeople] = useState<Person[]>([]);
  const [status, setStatus] = useState<LoadStatus>('idle');

  useEffect(() => {
    setStatus('loading');
    getPeople()
      .then(data => {
        setPeople(data);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, []);

  const isLoading = status === 'loading';
  const isError = status === 'error';
  const isEmpty = status === 'success' && people.length === 0;

  return (
    <>
      <h1 className={cn('title')}>People Page</h1>

      <div className={cn('block')}>
        <div className={cn('box', 'table-container')}>
          {isLoading && <Loader />}

          {isError && (
            <p
              data-cy="peopleLoadingError"
              className={cn('has-text-danger')}
            >
              Something went wrong
            </p>
          )}

          {isEmpty && (
            <p data-cy="noPeopleMessage" className={cn()}>
              There are no people on the server
            </p>
          )}

          {!isLoading && !isError && people.length > 0 && (
            <PeopleTable people={people} selectedSlug={slug ?? null} />
          )}
        </div>
      </div>
    </>
  );
};
