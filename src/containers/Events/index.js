import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null); // Initialiser à null pour gérer l'état initial sans filtrage
  const [currentPage, setCurrentPage] = useState(1);

  // Appliquer d'abord le filtrage par type, puis la pagination
  const filteredEvents = (
    type ? data?.events.filter(event => event.type === type) : data?.events
  ) || [];

  // Pagination des événements filtrés
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const changeType = (evtType) => {
    setCurrentPage(1); // Réinitialiser la page à 1 lors d'un changement de type
    setType(evtType); // Définir le type sélectionné
  };

  const pageNumber = Math.ceil((filteredEvents?.length || 0) / PER_PAGE); 

  const typeList = new Set(data?.events.map((event) => event.type));
  
  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        "Loading..."
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={changeType}
          />

          <div id="events" className="ListContainer">
            {paginatedEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
          {[...Array(pageNumber)].map((_, n) => (
            <a key={`page-${n + 1}`} href="#events" onClick={() => setCurrentPage(n + 1)}>
              {n + 1}
            </a>
          ))}
        </div>

        </>
      )}
    </>
  );
};

export default EventList;
