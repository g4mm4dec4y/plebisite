CREATE TABLE key_table(
    code VARCHAR(50),
    type VARCHAR(50),
    campaign VARCHAR(50)
);

CREATE TABLE active_campaigns (
    camp_key VARCHAR(50),
    status VARCHAR(50),
    duration DATETIME,
    selected_process VARCHAR(50),
    results_array VARCHAR(50),
    vote_page VARCHAR(50),
    organiser_page VARCHAR(50)
);