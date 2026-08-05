import type { SVGProps } from "react";

type DemoIconProps = SVGProps<SVGSVGElement>;

function createDemoIcon(glyph: string) {
  return function DemoIcon(props: DemoIconProps) {
    return (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <text
          x="12"
          y="16"
          fill="currentColor"
          fontFamily="sans-serif"
          fontSize="12"
          fontWeight="700"
          textAnchor="middle"
        >
          {glyph}
        </text>
      </svg>
    );
  };
}

export const FaArrowLeft = createDemoIcon("←");
export const FaArrowRight = createDemoIcon("→");
export const FaBell = createDemoIcon("!");
export const FaBolt = createDemoIcon("ϟ");
export const FaBook = createDemoIcon("B");
export const FaBug = createDemoIcon("B");
export const FaCalendar = createDemoIcon("C");
export const FaCalendarAlt = createDemoIcon("C");
export const FaChartLine = createDemoIcon("↗");
export const FaCheck = createDemoIcon("✓");
export const FaCheckCircle = createDemoIcon("✓");
export const FaCircle = createDemoIcon("•");
export const FaClipboardList = createDemoIcon("L");
export const FaClock = createDemoIcon("T");
export const FaCode = createDemoIcon("<>");
export const FaCog = createDemoIcon("⚙");
export const FaCogs = createDemoIcon("⚙");
export const FaCommentAlt = createDemoIcon("…");
export const FaCommentDots = createDemoIcon("…");
export const FaCompactDisc = createDemoIcon("○");
export const FaCopy = createDemoIcon("C");
export const FaEdit = createDemoIcon("E");
export const FaEllipsisV = createDemoIcon("⋮");
export const FaEnvelope = createDemoIcon("@");
export const FaExclamation = createDemoIcon("!");
export const FaExclamationTriangle = createDemoIcon("!");
export const FaExternalLinkAlt = createDemoIcon("↗");
export const FaFileAlt = createDemoIcon("F");
export const FaFolderOpen = createDemoIcon("F");
export const FaGithub = createDemoIcon("GH");
export const FaHome = createDemoIcon("H");
export const FaImage = createDemoIcon("I");
export const FaInbox = createDemoIcon("I");
export const FaInfoCircle = createDemoIcon("i");
export const FaInstagram = createDemoIcon("IG");
export const FaLinkedin = createDemoIcon("in");
export const FaMusic = createDemoIcon("♫");
export const FaNpm = createDemoIcon("N");
export const FaPaintBrush = createDemoIcon("P");
export const FaPaperclip = createDemoIcon("P");
export const FaPlus = createDemoIcon("+");
export const FaQuestionCircle = createDemoIcon("?");
export const FaRegSmile = createDemoIcon("☺");
export const FaRocket = createDemoIcon("R");
export const FaSearch = createDemoIcon("S");
export const FaServer = createDemoIcon("S");
export const FaSignOutAlt = createDemoIcon("→");
export const FaStar = createDemoIcon("★");
export const FaStop = createDemoIcon("■");
export const FaStopCircle = createDemoIcon("■");
export const FaTimes = createDemoIcon("×");
export const FaTimesCircle = createDemoIcon("×");
export const FaTrash = createDemoIcon("T");
export const FaTree = createDemoIcon("Y");
export const FaTwitter = createDemoIcon("X");
export const FaUser = createDemoIcon("U");
export const FaUsers = createDemoIcon("U");
export const FaYoutube = createDemoIcon("▶");
