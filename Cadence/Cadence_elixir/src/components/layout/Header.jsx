// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Bell, HelpCircle, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import NotificationsPopup from '@/components/layout/NotificationsPopup';
// ADICIONADO: Importar o hook do contexto
import { useActivityNotifications } from '@/context/ActivityNotificationContext'; 

const Header = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  // ADICIONADO: Obter a contagem de não lidas do contexto
  const { unreadCount } = useActivityNotifications(); 

  const handleFeatureClick = (feature) => {
    toast({
      title: "🚧 Esta funcionalidade ainda não foi implementada...",
      duration: 3000,
    });
  };
  
  const handleLogout = () => {
    toast({
      title: "Terminando sessão...",
      duration: 1500,
    });
    setTimeout(() => navigate('/auth'), 1500);
  }

  // onUnreadCountChange não é mais necessário, pois o Header consome o unreadCount do contexto
  // A função handleUnreadCountChange também não é mais necessária aqui

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-64 right-0 h-16 flex items-center justify-between px-6 z-20 bg-bg-light-primary border-b border-border-color"
    >
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light-secondary" 
            size={18}
          />
          <Input
            placeholder="Procurar..."
            className="pl-10 w-full"
            onClick={() => handleFeatureClick('search')}
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full transition-colors hover:bg-white/10 relative text-text-light-secondary bg-transparent bell-notification-button"
          >
            <Bell size={20} />
            {/* Usa unreadCount do contexto */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-color-primary"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-color-primary"></span>
              </span>
            )}
          </motion.button>
          {/* onUnreadCountChange removido, pois o NotificationsPopup não precisa mais dessa prop */}
          <NotificationsPopup 
            isVisible={showNotifications} 
            onClose={() => setShowNotifications(false)} 
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleFeatureClick('help')}
          className="p-2 rounded-full transition-colors hover:bg-white/10 text-text-light-secondary bg-transparent"
        >
          <HelpCircle size={20} />
        </motion.button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 p-2 rounded-lg transition-colors text-text-light-primary"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Utilizador" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium">João Silva</div>
                <div className="flex items-center space-x-1">
                  <div 
                    className="w-2 h-2 rounded-full status-online"
                  ></div>
                  <span className="text-xs text-text-light-secondary">
                    Online
                  </span>
                </div>
              </div>
              <ChevronDown size={16} className="text-text-light-secondary" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFeatureClick('settings')}>
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFeatureClick('preferences')}>
              Preferências
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Terminar Sessão
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};

export default Header;