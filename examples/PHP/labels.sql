-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Erstellungszeit: 16. Feb 2017 um 22:35
-- Server-Version: 5.5.54-0ubuntu0.12.04.1
-- PHP-Version: 5.6.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `labels`
--

CREATE TABLE `labels` (
  `lang` varchar(3) NOT NULL,
  `name` varchar(100) NOT NULL,
  `text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `labels`
--

INSERT INTO `labels` (`lang`, `name`, `text`) VALUES
('de', 'application title', 'Meine Applikation'),
('de', 'back', 'Zurück'),
('de', 'email', 'E-Mail Adresse'),
('de', 'Error during file processing', 'Fehler bei der Datei-Verarbeitung'),
('de', 'hello', 'Hallo!'),
('de', 'internet connection required', 'Internetverbindung erforderlich'),
('de', 'login', 'Anmelden'),
('de', 'nice to have you back again', 'Schön dich zu sehen.'),
('de', 'not a member yet', 'Noch kein Account?'),
('de', 'password', 'Passwort'),
('de', 'register', 'Registrieren'),
('en', 'application title', 'My Application'),
('en', 'back', 'Back'),
('en', 'email', 'E-Mail Address'),
('en', 'Error during file processing', 'Error during file processing'),
('en', 'hello', 'Hello!'),
('en', 'internet connection required', 'Internet connection required'),
('en', 'login', 'Login'),
('en', 'nice to have you back again', 'Nice to have you back again.'),
('en', 'not a member yet', 'Not a member yet?'),
('en', 'password', 'Password'),
('en', 'register', 'Register');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `labels`
--
ALTER TABLE `labels`
  ADD PRIMARY KEY (`lang`,`name`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
